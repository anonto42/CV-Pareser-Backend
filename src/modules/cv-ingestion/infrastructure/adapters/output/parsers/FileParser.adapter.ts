import { SingleFile } from "../../../../../../shared/types/singleFile.type";
import { FileParserPort } from "../../../../application/ports/output/FileParser.port";
import fs from 'fs';
import pdfParser from 'pdf-parse';
import { FileParserReturs } from "../../dto/FileParserReturs.dto";

export class FileParserAdapter implements FileParserPort {

  async parsePDF(file: SingleFile): Promise<FileParserReturs> {
    try {
      const fileBuffer = fs.readFileSync(file.path);
      const pdfParserRes = await pdfParser(fileBuffer);
      
      return new FileParserReturs(pdfParserRes.text, pdfParserRes.numpages, pdfParserRes.info);
      
    } catch (error: any) {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }
  
}
      