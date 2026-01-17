import { SingleFile } from "../../../../../shared/types/singleFile.type";

export interface UploadCSVCVUseCase {
  execute(file: SingleFile): Promise<void>;
}
