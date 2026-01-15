import { FileParserPort } from "../../../../application/ports/output/FileParser.port";
import * as pdfParse from 'pdf-parse';

export class FileParserAdapter implements FileParserPort {
  async parsePDF(file: string): Promise<any> {
    try {
      const data = await pdfParse(file);
      return {
        text: data.text,
        pages: data.numpages,
        info: data.info
      };
    } catch (error: any) {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }

  async parseCSV(file: string): Promise<any> {
    // CSV parsing logic
    return { parsed: true };
  }
}