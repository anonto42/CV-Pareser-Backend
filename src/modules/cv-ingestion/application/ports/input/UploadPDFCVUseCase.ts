import { SingleFile } from "../../../../../shared/types/singleFile.type";

export interface UploadPDFCVUseCase {
  execute(file: SingleFile): Promise<void>;
}