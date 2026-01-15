import { CVRepositoryPort } from "../../../../application/ports/output/CVRepository.port";
import { v4 as uuidv4 } from 'uuid';

export class CVRepositoryAdapter implements CVRepositoryPort {
  // Inject your database client here
  constructor(private db?: any) {}

  async save(cvData: any): Promise<string> {
    const cvId = uuidv4();
    
    // Database operation
    // await this.db.cv.create({ id: cvId, ...cvData });
    
    console.log("Saving CV to database:", cvId);
    return cvId;
  }

  async findById(id: string): Promise<any> {
    // await this.db.cv.findUnique({ where: { id } });
    return { id, data: "mock data" };
  }
}