import { ProcessedCVRepositoryPort } from "../../../../application/port/output/ProcessedCVRepository.port";
import { StructuredCV } from "../../../../application/dto/StructuredCV.dto";
import { VectorRecord } from "../../../../application/dto/VectorRecord.dto";
import { getPool } from "../../../config/database";

export class ProcessedCVRepositoryAdapter implements ProcessedCVRepositoryPort {

  private getPool() {
    return getPool();
  }

  async save(cv: StructuredCV, vectors: VectorRecord[]): Promise<void> {
    const pool = this.getPool();
    if (pool) {
      await pool.query(
        `insert into processed_cvs (id, cv, vectors)
         values ($1, $2::jsonb, $3::jsonb)
         on conflict (id) do update set cv = excluded.cv, vectors = excluded.vectors, updated_at = now()`,
        [cv.id, JSON.stringify(cv), JSON.stringify(vectors)]
      );
      return;
    }
  }

  async findById(cvId: string): Promise<{ cv: StructuredCV; vectors: VectorRecord[] } | null> {
    const pool = this.getPool();
    if (pool) {
      const res = await pool.query(
        `select cv, vectors from processed_cvs where id = $1 limit 1`,
        [cvId]
      );
      if (res.rowCount === 0) return null;

      return {
        cv: res.rows[0].cv as StructuredCV,
        vectors: res.rows[0].vectors as VectorRecord[]
      };
    }
    return null;
  }

  async update(cvId: string, cv: StructuredCV, vectors: VectorRecord[]): Promise<void> {
    const pool = this.getPool();
    if (pool) {
      const res = await pool.query(
        `update processed_cvs set cv = $2::jsonb, vectors = $3::jsonb, updated_at = now()
         where id = $1`,
        [cvId, JSON.stringify(cv), JSON.stringify(vectors)]
      );

      if (res.rowCount === 0) {
        throw new Error(`CV with id ${cvId} not found`);
      }
      return;
    }
  }

  async delete(cvId: string): Promise<void> {
    const pool = this.getPool();
    if (pool) {
      const res = await pool.query(
        `delete from processed_cvs where id = $1`,
        [cvId]
      );

      if (res.rowCount === 0) {
        throw new Error(`CV with id ${cvId} not found`);
      }
      return;
    }
  }

  async findAll(): Promise<{ cv: StructuredCV; vectors: VectorRecord[] }[]> {
    const pool = this.getPool();
    if (pool) {
      const res = await pool.query(
        `select cv, vectors from processed_cvs order by created_at desc`
      );

      return res.rows.map(row => ({
        cv: row.cv as StructuredCV,
        vectors: row.vectors as VectorRecord[]
      }));
    }
    return [];
  }

  async exists(cvId: string): Promise<boolean> {
    const pool = this.getPool();
    if (pool) {
      const res = await pool.query(
        `select 1 from processed_cvs where id = $1 limit 1`,
        [cvId]
      );

      return res.rowCount !== null && res.rowCount > 0;
    }
    return false;
  }
}

