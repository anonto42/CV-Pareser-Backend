import { Router } from 'express';
import { UploadPDFCVUseCaseImpl } from '../../application/usecases/UploadPDFCV.usecase';
import { CVRepositoryAdapter } from '../adapters/output/persistence/CVRepository.adapter';
import { FileParserAdapter } from '../adapters/output/parsers/FileParser.adapter';
import { CvIngestionController } from '../adapters/input/http/controllers/CvIngestion.controller';
import { CvIngestionRoutes } from '../adapters/input/http/routes/cvIngestion.routes';
import { DataForProcessUseCaseImpl } from '../../../cv-process/application/usecases/DataForProcess.usecase';

export class CvIngestionContainer {
  static createRouter(): Router {
    
    // Create output adapters
    const cvRepository = new CVRepositoryAdapter();
    const fileParser = new FileParserAdapter();

    // External dependencies
    const DataForProcessUseCase = new DataForProcessUseCaseImpl(); 

    // Create use cases
    const uploadPdfUseCase = new UploadPDFCVUseCaseImpl(
      cvRepository,
      fileParser,
      DataForProcessUseCase
    );

    // Create controller
    const controller = new CvIngestionController(uploadPdfUseCase);

    // Create and return routes
    const routes = new CvIngestionRoutes(controller);
    return routes.router;
  }
}