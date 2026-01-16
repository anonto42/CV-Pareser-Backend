import { VectorRecord } from "../../dto/VectorRecord.dto";

export interface VectorDBPort {
  upsert(records: VectorRecord[]): Promise<void>;
  query(queryText: string, topK: number, filter?: { cvId?: string; section?: string }): Promise<VectorRecord[]>;
  delete(recordId: string): Promise<void>;
  deleteByFilter(filter: { cvId?: string; section?: string }): Promise<number>;
  findById(recordId: string): Promise<VectorRecord | null>;
  findAll(): Promise<VectorRecord[]>;
}
