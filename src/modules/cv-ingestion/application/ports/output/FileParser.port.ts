import { SingleFile } from "../../../../../shared/types/singleFile.type";
import { FileParserReturs } from "../../../infrastructure/adapters/dto/FileParserReturs.dto";

export interface FileParserPort {
  parsePDF(file: SingleFile): Promise<FileParserReturs>;
}