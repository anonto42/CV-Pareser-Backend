import { StructuredCV } from "../../dto/StructuredCV.dto";
import { VectorRecord } from "../../dto/VectorRecord.dto";

export interface ProcessedCVRepositoryPort {
  save(cv: StructuredCV, vectors: VectorRecord[]): Promise<void>;
  findById(cvId: string): Promise<{ cv: StructuredCV; vectors: VectorRecord[] } | null>;
}
