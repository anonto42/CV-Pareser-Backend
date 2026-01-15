import { Request, Response, NextFunction } from "express";
import { UploadPDFCVUseCase } from "../../../../../application/ports/input/UploadPDFCVUseCase";
import sendResponse from '../../../../../../../shared/infrastructure/helper/sendResponse.helper';

export class CvIngestionController {
  constructor(
    private readonly uploadPdfUseCase: UploadPDFCVUseCase
  ) {}

  uploadPDF = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file || !req.file.buffer) {
        return sendResponse(res, {
          success: false,
          statusCode: 400,
          message: 'No file uploaded',
          data: null
        });
      }

      const cvId = await this.uploadPdfUseCase.execute(req.file.buffer);
      
      sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'CV uploaded successfully',
        data: { cvId }
      });
    } catch (error) {
      next(error);
    }
  };
}