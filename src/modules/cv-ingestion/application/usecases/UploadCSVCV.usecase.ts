import { StatusCodes } from "http-status-codes";
import ApiError from "../../../../shared/infrastructure/errors/api.error";
import { SingleFile } from "../../../../shared/types/singleFile.type";
import { DataForProcessUseCase } from "../../../cv-process/application/ports/input/DataForProcessUseCase";
import { UploadCSVCVUseCase } from "../ports/input/UploadCSVCVUseCase";
import { CSVParserPort } from "../ports/output/CSVParser.port";

export class UploadCSVCVUseCaseImpl implements UploadCSVCVUseCase {
  constructor(
    private readonly csvParser: CSVParserPort,
    private readonly dataForProcessUseCase: DataForProcessUseCase
  ) {}

  async execute(file: SingleFile): Promise<void> {
    const parsedDataArray = await this.csvParser.parseCSV(file);

    if (!parsedDataArray || parsedDataArray.length === 0) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to parse CSV');
    }

    // Process each row from the CSV
    for (const parsedData of parsedDataArray) {
      if (parsedData && parsedData.text) {
        await this.dataForProcessUseCase.execute({
          text: parsedData.text,
          filePath: file.path
        });
      }
    }

    return;
  }
}
