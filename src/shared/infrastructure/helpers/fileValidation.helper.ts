import path from 'path';
import { StatusCodes } from 'http-status-codes';
import { FileFieldName } from '../../types/fileUpload.types';
import ApiError from '../errors/api.error';
import { FILE_UPLOAD_CONFIGS } from '../config/fileUpload.config';

export class FileValidationHelper {
  
  //Validate file based on field name
  static validateFile(
    fieldName: string,
    mimetype: string,
    size: number
  ): void {
    const config = FILE_UPLOAD_CONFIGS[fieldName as FileFieldName];

    if (!config) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Unsupported file field: ${fieldName}`
      );
    }

    // Validate MIME type
    if (!config.allowedMimeTypes.includes(mimetype)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Invalid file type for ${fieldName}. Allowed types: ${config.allowedMimeTypes.join(', ')}`
      );
    }

    // Validate file size
    if (config.maxSize && size > config.maxSize) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `File size exceeds limit for ${fieldName}. Max size: ${config.maxSize / (1024 * 1024)}MB`
      );
    }
  }

  //Validate file extension
  static validateExtension(
    fieldName: string,
    originalName: string
  ): void {
    const config = FILE_UPLOAD_CONFIGS[fieldName as FileFieldName];
    
    if (!config) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Unsupported file field: ${fieldName}`
      );
    }

    const fileExt = path.extname(originalName).toLowerCase();
    
    if (!config.allowedExtensions.includes(fileExt)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Invalid file extension for ${fieldName}. Allowed: ${config.allowedExtensions.join(', ')}`
      );
    }
  }
}