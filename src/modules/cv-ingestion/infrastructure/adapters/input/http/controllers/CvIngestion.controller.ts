import { Request, Response, NextFunction } from "express";
import { UploadPDFCVUseCase } from "../../../../../application/ports/input/UploadPDFCVUseCase";
import { UploadCSVCVUseCase } from "../../../../../application/ports/input/UploadCSVCVUseCase";
import sendResponse from '../../../../../../../shared/infrastructure/helpers/sendResponse.helper';
import catchAsync from '../../../../../../../shared/infrastructure/helpers/catchAsync.helper';
import ApiError from "../../../../../../../shared/infrastructure/errors/api.error";
import { StatusCodes } from "http-status-codes";

export class CvIngestionController {
  constructor(
    private readonly uploadPdfUseCase: UploadPDFCVUseCase,
    private readonly uploadCsvUseCase: UploadCSVCVUseCase
  ) {}

  uploadPDF = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  
    if (!req.file) throw new ApiError(StatusCodes.BAD_REQUEST, 'No file uploaded');

    const response = await this.uploadPdfUseCase.execute(req.file);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'CV uploaded successfully',
      data: response
    });
  });

  uploadCSV = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  
    if (!req.file) throw new ApiError(StatusCodes.BAD_REQUEST, 'No file uploaded');

    const response = await this.uploadCsvUseCase.execute(req.file);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'CSV uploaded successfully',
      data: response
    });
  });
}
