import { VectorRecord } from "../../../../application/dto/VectorRecord.dto";
import { VectorDBPort } from "../../../../application/port/output/VactorDB.port";
import { EmbeddingModelPort } from "../../../../application/port/output/EmbeddingModel.port";
import config from "../../../config";
import { COLLECTION_NAME, ensureCollection, qdrantClient } from "../../../config/qdrant";
import { XenovaEmbeddingAdapter } from "../embedding/Xenova.embedding.adapter";

export class VectorDBAdapter implements VectorDBPort {
  private collectionEnsured = false;
  private readonly store = new Map<string, VectorRecord>();
  private embeddingModel: EmbeddingModelPort;

  constructor(embeddingModel?: EmbeddingModelPort) {
    this.embeddingModel = embeddingModel || new XenovaEmbeddingAdapter();
  }

  private async ensureCollectionReady(): Promise<void> {
    if (this.collectionEnsured) return;
    await ensureCollection(config.vector.dimension);
    this.collectionEnsured = true;
  }

  private toQdrantPoint(record: VectorRecord) {
    if (!record.embedding) {
      throw new Error(`VectorRecord '${record.id}' is missing embedding. Create embeddings before upsert.`);
    }

    const numericId = this.stringToNumericId(record.id);

    return {
      id: numericId,
      vector: record.embedding,
      payload: {
        id: record.id,
        text: record.text,
        cvId: record.metadata.cvId,
        section: record.metadata.section,
        chunkIndex: record.metadata.chunkIndex,
        email: record.metadata.email,
        phone: record.metadata.phone,
        location: record.metadata.location,
        skills: record.metadata.skills
      }
    };
  }

  private stringToNumericId(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  private async embedText(text: string): Promise<number[]> {
    return this.embeddingModel.embedText(text);
  }

  async upsert(records: VectorRecord[]): Promise<void> {
    await this.ensureCollectionReady();

    const points = records.map((r) => this.toQdrantPoint(r));
    
    await qdrantClient.upsert(COLLECTION_NAME, {
      points
    });

    for (const r of records) {
      this.store.set(r.id, r);
    }
  }

  async query(queryText: string, topK: number, filter?: { cvId?: string; section?: string }): Promise<VectorRecord[]> {
    await this.ensureCollectionReady();
    const vector = await this.embedText(queryText);

    const must: any[] = [];
    if (filter?.cvId) must.push({ key: "cvId", match: { value: filter.cvId } });
    if (filter?.section) must.push({ key: "section", match: { value: filter.section } });

    const searchBody: any = {
      vector,
      limit: topK,
      with_payload: true
    };
    if (must.length > 0) searchBody.filter = { must };

    const searchResult = await qdrantClient.search(COLLECTION_NAME, searchBody);

    return (searchResult as any[]).map((p, idx) => {
      const payload = (p.payload ?? {}) as Record<string, unknown>;
      return {
        id: String(p.id),
        text: (payload.text as string) ?? "",
        metadata: {
          cvId: (payload.cvId as string) ?? "",
          section: (payload.section as any) ?? "other",
          chunkIndex: (payload.chunkIndex as number) ?? idx,
          email: (payload.email as string | undefined),
          phone: (payload.phone as string | undefined),
          location: (payload.location as string | undefined),
          skills: (payload.skills as string[] | undefined)
        }
      } as VectorRecord;
    });
  }

  async delete(recordId: string): Promise<void> {
    await this.ensureCollectionReady();

    await qdrantClient.delete(COLLECTION_NAME, {
      points: [recordId]
    });

    this.store.delete(recordId);
  }

  async deleteByFilter(filter: { cvId?: string; section?: string }): Promise<number> {
    await this.ensureCollectionReady();

    const must: any[] = [];
    if (filter.cvId) must.push({ key: "cvId", match: { value: filter.cvId } });
    if (filter.section) must.push({ key: "section", match: { value: filter.section } });

    if (must.length === 0) {
      throw new Error("At least one filter criteria must be provided");
    }

    const deleteBody: any = {
      filter: { must }
    };

    await qdrantClient.delete(COLLECTION_NAME, deleteBody);
    
    // Remove from local store
    let deletedCount = 0;
    for (const [id, record] of this.store.entries()) {
      let matches = true;
      if (filter.cvId && record.metadata.cvId !== filter.cvId) matches = false;
      if (filter.section && record.metadata.section !== filter.section) matches = false;
      
      if (matches) {
        this.store.delete(id);
        deletedCount++;
      }
    }

    return deletedCount;
  }

  async findById(recordId: string): Promise<VectorRecord | null> {
    await this.ensureCollectionReady();

    const cached = this.store.get(recordId);
    if (cached) return cached;

    try {
      const result = await qdrantClient.retrieve(COLLECTION_NAME, {
        ids: [recordId],
        with_payload: true
      });

      if (result.length === 0) return null;

      const p = result[0];
      const payload = (p.payload ?? {}) as Record<string, unknown>;

      const record: VectorRecord = {
        id: String(p.id),
        text: (payload.text as string) ?? "",
        metadata: {
          cvId: (payload.cvId as string) ?? "",
          section: (payload.section as any) ?? "other",
          chunkIndex: (payload.chunkIndex as number) ?? 0,
          email: (payload.email as string | undefined),
          phone: (payload.phone as string | undefined),
          location: (payload.location as string | undefined),
          skills: (payload.skills as string[] | undefined)
        }
      };

      this.store.set(recordId, record);
      return record;
    } catch (error) {
      console.error(`Error retrieving record ${recordId}:`, error);
      return null;
    }
  }

  async findAll(): Promise<VectorRecord[]> {
    await this.ensureCollectionReady();

    try {
      const result = await qdrantClient.scroll(COLLECTION_NAME, {
        limit: 1000,
        with_payload: true
      });

      return (result.points as any[]).map((p) => {
        const payload = (p.payload ?? {}) as Record<string, unknown>;
        return {
          id: String(p.id),
          text: (payload.text as string) ?? "",
          metadata: {
            cvId: (payload.cvId as string) ?? "",
            section: (payload.section as any) ?? "other",
            chunkIndex: (payload.chunkIndex as number) ?? 0,
            email: (payload.email as string | undefined),
            phone: (payload.phone as string | undefined),
            location: (payload.location as string | undefined),
            skills: (payload.skills as string[] | undefined)
          }
        } as VectorRecord;
      });
    } catch (error) {
      console.error("Error fetching all records:", error);
      return Array.from(this.store.values());
    }
  }
}
