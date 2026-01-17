import { SingleFile } from "../../../../../shared/types/singleFile.type";
import { FileParserReturs } from "../../../infrastructure/adapters/dto/FileParserReturs.dto";

export interface CSVParserPort {
  parseCSV(file: SingleFile): Promise<FileParserReturs[]>;
}
