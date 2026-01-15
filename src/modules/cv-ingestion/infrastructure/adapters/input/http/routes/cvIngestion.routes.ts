import { Router } from 'express';
import { CvIngestionController } from '../controllers/CvIngestion.controller';
import validateRequest from '../../../../../../../shared/infrastructure/middlewares/validateRequest.middleware';
import { CVIngestionValidator } from './../validator/cvIngestion.validator';
import { uploadSingleCVToDisk } from './../../../../../../../shared/infrastructure/middlewares/fileUpload.middleware';

export class CvIngestionRoutes {
  public router: Router;

  constructor(
    private readonly controller: CvIngestionController
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router
    .route('/upload-pdf')
    .post(
      uploadSingleCVToDisk,
      validateRequest(CVIngestionValidator.pdfUpload),
      this.controller.uploadPDF
    );

  }
}