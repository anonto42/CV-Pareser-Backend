
export interface FileParserPort {
  parsePDF(file: string): Promise<any>;
  parseCSV(file: string): Promise<any>;
}