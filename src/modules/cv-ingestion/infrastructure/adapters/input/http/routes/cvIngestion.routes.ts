import { Router } from 'express';
import multer from 'multer';
import { CvIngestionController } from '../controllers/CvIngestion.controller';
import validateRequest from '../../../../../../../shared/infrastructure/middlewares/validateRequest.middleware';
import { CVIngestionValidator } from './../validator/cvIngestion.validator';

const upload = multer({ storage: multer.memoryStorage() });

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
      validateRequest(CVIngestionValidator.pdfUpload),
      this.controller.uploadPDF
    );

  }
}