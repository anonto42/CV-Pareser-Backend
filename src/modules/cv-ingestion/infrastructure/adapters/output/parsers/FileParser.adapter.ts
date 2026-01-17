import { SingleFile } from "../../../../../../shared/types/singleFile.type";
import { FileParserPort } from "../../../../application/ports/output/FileParser.port";
import { CSVParserPort } from "../../../../application/ports/output/CSVParser.port";
import fs from 'fs';
import pdfParser from 'pdf-parse';
import csv from 'csv-parser';
import { FileParserReturs } from "../../dto/FileParserReturs.dto";

export class FileParserAdapter implements FileParserPort, CSVParserPort {

  async parsePDF(file: SingleFile): Promise<FileParserReturs> {
    try {
      const fileBuffer = fs.readFileSync(file.path);
      const pdfParserRes = await pdfParser(fileBuffer);
      
      return { text: pdfParserRes.text, pages: pdfParserRes.numpages, info: pdfParserRes.info };
      
    } catch (error: any) {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }

  async parseCSV(file: SingleFile): Promise<FileParserReturs[]> {
    return new Promise((resolve, reject) => {
      try {
        const results: FileParserReturs[] = [];
        
        fs.createReadStream(file.path)
          .pipe(csv())
          .on('data', (row: any) => {
            // Convert each row to a string representation
            const rowText = Object.values(row).join(' | ');
            results.push({ text: rowText, pages: 1, info: row });
          })
          .on('end', () => {
            resolve(results);
          })
          .on('error', (error: any) => {
            reject(new Error(`Failed to parse CSV: ${error.message}`));
          });
      } catch (error: any) {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      }
    });
  }
  
}
      