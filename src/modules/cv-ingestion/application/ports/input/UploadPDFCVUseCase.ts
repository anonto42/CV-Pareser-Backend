
export interface UploadPDFCVUseCase {
  execute(file: string): Promise<string>;
}