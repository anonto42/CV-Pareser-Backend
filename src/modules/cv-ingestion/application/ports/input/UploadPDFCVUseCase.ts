
export interface UploadPDFCVUseCase {
  execute(file: File): Promise<string>;
}