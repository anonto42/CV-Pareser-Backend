import { StatusCodes } from "http-status-codes";
import ApiError from "../../../../shared/infrastructure/errors/api.error";
import { SingleFile } from "../../../../shared/types/singleFile.type";
import { ProcessDataFormet } from "../../../cv-process/application/dto/ProcessingDataFormet.dto";
import { DataForProcessUseCase } from "../../../cv-process/application/ports/input/DataForProcessUseCase";
import { UploadPDFCVUseCase } from "../ports/input/UploadPDFCVUseCase";
import { CVRepositoryPort } from "../ports/output/CVRepository.port";
import { FileParserPort } from "../ports/output/FileParser.port";

export class UploadPDFCVUseCaseImpl implements UploadPDFCVUseCase {
  constructor(
    private readonly cvRepository: CVRepositoryPort,
    private readonly fileParser: FileParserPort,
    private readonly dataForProcessUseCase: DataForProcessUseCase
  ) {}

  async execute(file: SingleFile): Promise<string> {
    try {

      // Parse the PDF
      const parsedData = await this.fileParser.parsePDF(file);

      // Business logic/validation here
      if (!parsedData) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to parse CV');
      }

      // Send data to process Hexgon
      const savedCV = await this.cvRepository.save(parsedData);
      
      await this.dataForProcessUseCase.execute(new ProcessDataFormet(parsedData.text, 'this is the id'));
      
      return savedCV;

    } catch (error) {
      throw error;
    }
  }
}