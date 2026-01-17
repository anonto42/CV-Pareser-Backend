import { UploadPDFCVUseCaseImpl } from '../../application/usecases/UploadPDFCV.usecase';
import { FileParserAdapter } from '../adapters/output/parsers/FileParser.adapter';
import { CvIngestionController } from '../adapters/input/http/controllers/CvIngestion.controller';
import { createCvIngestionRoutes } from '../adapters/input/http/routes/cvIngestion.routes';
import { CvProcessContainer } from '../../../cv-process/infrastructure/di/cvProcess.container';

export class CvIngestionContainer {
  private static instance: CvIngestionContainer;

  private uploadPdfUseCase: UploadPDFCVUseCaseImpl;
  private cvIngestionController: CvIngestionController;

  private constructor() {
    const fileParser = new FileParserAdapter();
    const dataProcessor = CvProcessContainer.createDataForProcessUseCase();

    this.uploadPdfUseCase = new UploadPDFCVUseCaseImpl(
      fileParser,
      dataProcessor
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