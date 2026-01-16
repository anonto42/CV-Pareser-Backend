import { ProcessDataFormet } from "../dto/ProcessingDataFormet.dto";
import { CVSection, CVSectionType, StructuredCV } from "../../../../shared/application/dto/StructuredCV.dto";
import { VectorRecord } from "../../../../shared/application/dto/VectorRecord.dto";
import { DataForProcessUseCase } from "../ports/input/DataForProcessUseCase";
import { ProcessedCVRepositoryPort } from "../../../../shared/application/port/output/ProcessedCVRepository.port";
import { VectorDBPort } from "../../../../shared/application/port/output/VactorDB.port";
import { EmbeddingModelPort } from "../../../../shared/application/port/output/EmbeddingModel.port";
import { XenovaEmbeddingAdapter } from "../../../../shared/infrastructure/adapter/output/embedding/Xenova.embedding.adapter";

const HEADER_MAP: Array<{ header: RegExp; type: CVSectionType }> = [
  { header: /^summary$/i, type: "summary" },
  { header: /^skills$/i, type: "skills" },
  { header: /^experience$/i, type: "experience" },
  { header: /^projects$/i, type: "projects" },
  { header: /^education$/i, type: "education" },
  { header: /^certifications?$/i, type: "certifications" },
  { header: /^languages?$/i, type: "languages" }
];

export class DataForProcessUseCaseImpl implements DataForProcessUseCase {
  private embeddingModel: EmbeddingModelPort;

  constructor(
    private readonly processedCVRepository: ProcessedCVRepositoryPort,
    private readonly vectorDB: VectorDBPort
  ) {
    // Initialize Xenova embedding adapter
    this.embeddingModel = new XenovaEmbeddingAdapter();
  }

  public async execute(data: ProcessDataFormet): Promise<void> {
    const normalized = this.normalizeText(data.text);
    const sections = this.splitIntoSections(normalized);

    const structured: StructuredCV = {
      id: data.id,
      personal: {
        name: this.guessName(normalized),
        email: this.extractEmail(normalized),
        phone: this.extractPhone(normalized),
        linkedin: this.extractLinkedIn(normalized),
        github: this.extractGitHub(normalized),
        location: this.extractLocation(normalized)
      },
      skills: this.extractSkillsFromSections(sections),
      sections
    };

    const vectorRecords = this.buildVectorRecords(structured);

    for (const record of vectorRecords) {
      try {
        record.embedding = await this.embeddingModel.embedText(record.text);
      } catch (error) {
        throw error;
      }
    }

    await this.processedCVRepository.save(structured, vectorRecords);
    await this.vectorDB.upsert(vectorRecords);
  }

  private normalizeText(raw: string): string {
    return raw
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  private splitIntoSections(text: string): CVSection[] {
    const lines = text.split("\n").map((l) => l.trim());
    const sections: CVSection[] = [];

    let currentType: CVSectionType = "other";
    let buffer: string[] = [];

    const flush = () => {
      const joined = buffer.join("\n").trim();
      if (joined) {
        sections.push({ type: currentType, text: joined });
      }
      buffer = [];
    };

    for (const line of lines) {
      const matched = HEADER_MAP.find((h) => h.header.test(line));
      if (matched) {
        flush();
        currentType = matched.type;
        continue;
      }
      buffer.push(line);
    }

    flush();
    return sections;
  }

  private extractEmail(text: string): string | undefined {
    return text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/)?.[0];
  }

  private extractPhone(text: string): string | undefined {
    return text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0];
  }

  private extractLinkedIn(text: string): string | undefined {
    const m = text.match(/linkedin\.com\/in\/[\w-]+/i)?.[0];
    return m ? `https://${m}` : undefined;
  }

  private extractGitHub(text: string): string | undefined {
    const m = text.match(/github\.com\/[\w-]+/i)?.[0];
    return m ? `https://${m}` : undefined;
  }

  private guessName(text: string): string | undefined {
    const firstNonEmpty = text
      .split("\n")
      .map((l) => l.trim())
      .find(Boolean);
    return firstNonEmpty;
  }

  private extractLocation(text: string): string | undefined {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const contactLine = lines.find((l) => /@/.test(l) || /\d{10,}/.test(l));
    if (!contactLine) return undefined;

    const candidate = contactLine.split(/•|\||,/).map((p) => p.trim()).find((p) => !/@/.test(p) && !/\d/.test(p));
    return candidate;
  }

  private extractSkillsFromSections(sections: CVSection[]): string[] {
    const skillsSection = sections.find((s) => s.type === "skills")?.text ?? "";
    const candidates = skillsSection
      .split(/[,•\n\-]/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 2 && s.length <= 60);

    return [...new Set(candidates)].filter(Boolean);
  }

  private chunkText(text: string, maxChars = 2000, overlapChars = 200): string[] {
    const cleaned = text.trim();
    if (cleaned.length <= maxChars) return [cleaned];

    const chunks: string[] = [];
    let start = 0;

    while (start < cleaned.length) {
      const end = Math.min(start + maxChars, cleaned.length);
      const chunk = cleaned.slice(start, end).trim();
      if (chunk) chunks.push(chunk);
      if (end === cleaned.length) break;
      start = Math.max(0, end - overlapChars);
    }

    return chunks;
  }

  private buildVectorRecords(cv: StructuredCV): VectorRecord[] {
    const records: VectorRecord[] = [];
    const metadataSkills = cv.skills.slice(0, 25);

    cv.sections.forEach((section) => {
      const chunks = this.chunkText(section.text);
      chunks.forEach((chunk, idx) => {
        records.push({
          id: `${cv.id}_${section.type}_${idx}`,
          text: chunk,
          metadata: {
            cvId: cv.id,
            section: section.type,
            chunkIndex: idx,
            email: cv.personal.email,
            phone: cv.personal.phone,
            location: cv.personal.location,
            skills: metadataSkills
          }
        });
      });
    });

    return records;
  }
}