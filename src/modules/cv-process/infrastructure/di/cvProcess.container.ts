import { Router } from 'express';
import { DataForProcessUseCase } from '../../application/ports/input/DataForProcessUseCase';
import { DataForProcessUseCaseImpl } from '../../application/usecases/DataForProcess.usecase';
import { ProcessedCVRepositoryAdapter } from '../../../../shared/infrastructure/adapter/output/persistence/ProcessedCVRepository.adapter';
import { VectorDBAdapter } from '../../../../shared/infrastructure/adapter/output/vector-db/VectorDB.adapter';

export class CvProcessContainer {

  // For Implement on other hexagon
  static createDataForProcessUseCase(): DataForProcessUseCase {
    const processedCVRepository = new ProcessedCVRepositoryAdapter();
    const vectorDB = new VectorDBAdapter();

    return new DataForProcessUseCaseImpl(processedCVRepository, vectorDB);
  }

  // For Implement on routes
  static createRouter(): Router {
    
    return Router();
  }
}