import { ProcessedCVRepositoryPort } from "../../../../application/port/output/ProcessedCVRepository.port";
import { StructuredCV } from "../../../../application/dto/StructuredCV.dto";
import { VectorRecord } from "../../../../application/dto/VectorRecord.dto";
import config from "../../../config";
import { Pool } from "pg";

export class ProcessedCVRepositoryAdapter implements ProcessedCVRepositoryPort {
  private readonly pool?: Pool;

  constructor() {
    if (config.postgres.url) {
      this.pool = new Pool({ connectionString: config.postgres.url });
    }
  }

  private readonly store = new Map<string, { cv: StructuredCV; vectors: VectorRecord[] }>();

  async save(cv: StructuredCV, vectors: VectorRecord[]): Promise<void> {
    if (this.pool) {
      await this.pool.query(
        `insert into processed_cvs (id, cv, vectors)
         values ($1, $2::jsonb, $3::jsonb)
         on conflict (id) do update set cv = excluded.cv, vectors = excluded.vectors, updated_at = now()`,
        [cv.id, JSON.stringify(cv), JSON.stringify(vectors)]
      );
      return;
    }

    this.store.set(cv.id, { cv, vectors });

    console.log("Saved processed CV to normal DB:", {
      id: cv.id,
      sections: cv.sections.length,
      vectors: vectors.length
    });
  }

  async findById(cvId: string): Promise<{ cv: StructuredCV; vectors: VectorRecord[] } | null> {
    if (this.pool) {
      const res = await this.pool.query(
        `select cv, vectors from processed_cvs where id = $1 limit 1`,
        [cvId]
      );
      if (res.rowCount === 0) return null;

      return {
        cv: res.rows[0].cv as StructuredCV,
        vectors: res.rows[0].vectors as VectorRecord[]
      };
    }

    const existing = this.store.get(cvId);
    if (existing) return existing;

    return null;
  }
}
