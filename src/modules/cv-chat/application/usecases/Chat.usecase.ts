import { ChatUseCase } from "../ports/input/ChatUseCase.port";
import { AIModelPort } from "../ports/output/AIModel.port";
import { VectorDBPort } from "../../../../shared/application/port/output/VactorDB.port";
import { ProcessedCVRepositoryPort } from "../../../../shared/application/port/output/ProcessedCVRepository.port";
import { ChatContext } from "../dto/Chat.dto";
import { IChatReturn } from "../dto/ChatReturn.dto";

export class ChatUseCaseImpl implements ChatUseCase {
  constructor(
    private readonly aiModel: AIModelPort,
    private readonly vectorDb: VectorDBPort,
    private readonly cvRepository: ProcessedCVRepositoryPort
  ) {}

  async execute(prompt: string): Promise<IChatReturn> {
    try {
      const vectorSearchResults = await this.vectorDb.query(prompt, 5);
      const uniqueCvIds = [...new Set(vectorSearchResults.map(r => r.metadata.cvId))];

      const cvRecords = [];
      for (const cvId of uniqueCvIds) {
        const cvData = await this.cvRepository.findById(cvId);
        if (cvData) {
          cvRecords.push(cvData.cv);
        }
      }

      const context = this.buildContext({
        vectorSearchResults,
        cvData: cvRecords,
        prompt
      });

      const answer = await this.aiModel.generateAnswer(prompt, context);

      return {
        answer,
        sources: {
          vectorRecords: vectorSearchResults,
          cvRecords
        }
      };
    } catch (error) {
      console.error("Chat use case error:", error);
      throw error;
    }
  }

  private buildContext(chatContext: ChatContext): string {
    let context = `You are an AI assistant helping to find information from CVs and professional profiles.`;

    if (chatContext.vectorSearchResults.length > 0) {
      context += `\n\n## Relevant Information from CVs:\n`;
      chatContext.vectorSearchResults.forEach((record, idx) => {
        context += `\n### Result ${idx + 1}:\n`;
        context += `**Text:** ${record.text}\n`;
        context += `**Section:** ${record.metadata.section}\n`;
        if (record.metadata.email) context += `**Email:** ${record.metadata.email}\n`;
        if (record.metadata.phone) context += `**Phone:** ${record.metadata.phone}\n`;
        if (record.metadata.skills?.length) context += `**Skills:** ${record.metadata.skills.join(", ")}\n`;
      });
    }

    if (chatContext.cvData.length > 0) {
      context += `\n\n## CV Summary:\n`;
      chatContext.cvData.forEach((cv, idx) => {
        context += `\n### CV ${idx + 1}:\n`;
        context += `**Name:** ${cv.personal.name || "Not provided"}\n`;
        context += `**Skills:** ${cv.skills.join(", ") || "Not provided"}\n`;
        context += `**Sections:** ${cv.sections.length} sections available\n`;
      });
    }

    context += `\n\nUser Query: ${chatContext.prompt}`;

    return context;
  }
}
