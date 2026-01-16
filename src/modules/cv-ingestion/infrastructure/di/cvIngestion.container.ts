import { UploadPDFCVUseCaseImpl } from '../../application/usecases/UploadPDFCV.usecase';
import { CVRepositoryAdapter } from '../adapters/output/persistence/CVRepository.adapter';
import { FileParserAdapter } from '../adapters/output/parsers/FileParser.adapter';
import { CvIngestionController } from '../adapters/input/http/controllers/CvIngestion.controller';
import { CvProcessContainer } from '../../../cv-process/infrastructure/di/cvProcess.container';
import { createCvIngestionRoutes } from '../adapters/input/http/routes/cvIngestion.routes';

export class CvIngestionContainer {
  private static instance: CvIngestionContainer;

  private uploadPdfUseCase: UploadPDFCVUseCaseImpl;
  private cvIngestionController: CvIngestionController;

  private constructor() {
    const cvRepository = new CVRepositoryAdapter();
    const fileParser = new FileParserAdapter();

    const dataForProcessUseCase = CvProcessContainer.createDataForProcessUseCase();

    this.uploadPdfUseCase = new UploadPDFCVUseCaseImpl(
      cvRepository,
      fileParser,
      dataForProcessUseCase
    );

    this.cvIngestionController = new CvIngestionController(this.uploadPdfUseCase);
  }

  static getInstance(): CvIngestionContainer {
    if (!CvIngestionContainer.instance) {
      CvIngestionContainer.instance = new CvIngestionContainer();
    }
    return CvIngestionContainer.instance;
  }

  getController(): CvIngestionController {
    return this.cvIngestionController;
  }

  getRoutes() {
    return createCvIngestionRoutes(this.cvIngestionController);
  }
}