
export interface CVRepositoryPort {
  save(cvData: any): Promise<string>;
  findById(id: string): Promise<any>;
}