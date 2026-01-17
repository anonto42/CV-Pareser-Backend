import { StructuredCV } from "../../dto/StructuredCV.dto";
import { VectorRecord } from "../../dto/VectorRecord.dto";

export interface ProcessedCVRepositoryPort {
  save(cv: StructuredCV, vectors?: VectorRecord[]): Promise<void>;
  findById(cvId: string): Promise<{ cv: StructuredCV; vectors: VectorRecord[] } | null>;
  update(cvId: string, cv: StructuredCV, vectors?: VectorRecord[]): Promise<void>;
  delete(cvId: string): Promise<void>;
  findAll(): Promise<{ cv: StructuredCV; vectors: VectorRecord[] }[]>;
  exists(cvId: string): Promise<boolean>;
}
