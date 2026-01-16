import { Router } from 'express';
import { CvIngestionController } from '../controllers/CvIngestion.controller';
import validateRequest from '../../../../../../../shared/infrastructure/middlewares/validateRequest.middleware';
import { CVIngestionValidator } from './../validator/cvIngestion.validator';
import { uploadSingleCVToDisk } from './../../../../../../../shared/infrastructure/middlewares/fileUpload.middleware';

export function createCvIngestionRoutes(controller: CvIngestionController): Router {
  const router = Router();

  router.route('/upload-pdf').post(uploadSingleCVToDisk, validateRequest(CVIngestionValidator.pdfUpload), controller.uploadPDF);

  return router;
}
