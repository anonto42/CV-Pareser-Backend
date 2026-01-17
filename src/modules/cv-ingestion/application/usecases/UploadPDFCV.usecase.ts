import { StatusCodes } from "http-status-codes";
import ApiError from "../../../../shared/infrastructure/errors/api.error";
import { SingleFile } from "../../../../shared/types/singleFile.type";
import { ProcessDataFormet } from "../../../cv-process/application/dto/ProcessingDataFormet.dto";
import { DataForProcessUseCase } from "../../../cv-process/application/ports/input/DataForProcessUseCase";
import { UploadPDFCVUseCase } from "../ports/input/UploadPDFCVUseCase";
import { FileParserPort } from "../ports/output/FileParser.port";

export class UploadPDFCVUseCaseImpl implements UploadPDFCVUseCase {
  constructor(
    private readonly fileParser: FileParserPort,
    private readonly dataForProcessUseCase: DataForProcessUseCase
  ) {}

  async execute(file: SingleFile): Promise<void> {
    const parsedData = await this.fileParser.parsePDF(file);

    if (!parsedData) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to parse CV');
    }
      
    await this.dataForProcessUseCase.execute({text: parsedData.text, filePath: file.path});

    return;
  }
}