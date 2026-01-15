import { UploadPDFCVUseCase } from "../ports/input/UploadPDFCVUseCase";
import { CVRepositoryPort } from "../ports/output/CVRepository.port";
import { FileParserPort } from "../ports/output/FileParser.port";

export class UploadPDFCVUseCaseImpl implements UploadPDFCVUseCase {
  constructor(
    private readonly cvRepository: CVRepositoryPort,
    private readonly fileParser: FileParserPort
  ) {}

  async execute(file: string): Promise<string> {
    try {
      // Parse the PDF
      const parsedData = await this.fileParser.parsePDF(file);
      
      // Business logic/validation here
      if (!parsedData) {
        throw new Error("Failed to parse CV");
      }

      // Save to repository
      const cvId = await this.cvRepository.save({
        rawData: file,
        parsedData,
        uploadedAt: new Date()
      });

      return cvId;
    } catch (error) {
      throw error;
    }
  }
}