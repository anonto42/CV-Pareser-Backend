import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../errors/api.error';
import { FileSystemHelper } from '../helpers/fileSystem.helper';
import { FileValidationHelper } from '../helpers/fileValidation.helper';
import { FileFieldName } from '../../types/fileUpload.types';
import { FILE_UPLOAD_CONFIGS } from '../config/fileUpload.config';

export class FileUploadMiddleware {
  
  // Initialize upload directories on app start
  static initializeDirectories(): void {
    const dirs = Object.values(FILE_UPLOAD_CONFIGS).map(config => config.destination);
    FileSystemHelper.initializeUploadDirs(dirs);
  }

  // Disk storage configuration
  private static getDiskStorage() {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        try {
          const config = FILE_UPLOAD_CONFIGS[file.fieldname as FileFieldName];
          
          if (!config) {
            return cb(
              new ApiError(
                StatusCodes.BAD_REQUEST,
                `Unsupported file field: ${file.fieldname}`
              ),
              ''
            );
          }

          const uploadDir = config.destination;
          // const uploadDir = path.join(process.cwd(), config.destination);
          FileSystemHelper.createDirIfNotExists(uploadDir);
          cb(null, uploadDir);
        } catch (error: any) {
          cb(error, '');
        }
      },
      filename: (req, file, cb) => {
        try {
          const uniqueFilename = FileSystemHelper.generateUniqueFilename(
            file.originalname
          );
          cb(null, uniqueFilename);
        } catch (error: any) {
          cb(error, '');
        }
      },
    });
  }

  // Memory storage configuration (for processing)
  private static getMemoryStorage() {
    return multer.memoryStorage();
  }
  
  // File filter
  private static fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ): void {
    try {
      // Validate file extension
      FileValidationHelper.validateExtension(file.fieldname, file.originalname);
      
      // Validate mime type (size will be validated after upload)
      FileValidationHelper.validateFile(file.fieldname, file.mimetype, 0);
      
      cb(null, true);
    } catch (error: any) {
      cb(error);
    }
  }

  // Create upload handler for multiple file types (disk storage)
  static createMultipleFileHandler() {
    return multer({
      storage: this.getDiskStorage(),
      fileFilter: this.fileFilter,
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB max
      },
    }).fields([
      { name: FileFieldName.IMAGE, maxCount: 5 },
      { name: FileFieldName.MEDIA, maxCount: 3 },
      { name: FileFieldName.DOC, maxCount: 3 },
      { name: FileFieldName.CV, maxCount: 1 },
      { name: FileFieldName.CSV, maxCount: 1 },
    ]);
  }

  // Create single file handler (disk storage)
  static createSingleFileHandler(fieldName: FileFieldName, maxSize?: number) {
    const config = FILE_UPLOAD_CONFIGS[fieldName];
    
    return multer({
      storage: this.getDiskStorage(),
      fileFilter: this.fileFilter,
      limits: {
        fileSize: maxSize || config.maxSize || 10 * 1024 * 1024,
      },
    }).single(fieldName);
  }

  // Create single file handler with memory storage (for processing)
  static createMemoryFileHandler(fieldName: FileFieldName, maxSize?: number) {
    const config = FILE_UPLOAD_CONFIGS[fieldName];
    
    return multer({
      storage: this.getMemoryStorage(),
      fileFilter: this.fileFilter,
      limits: {
        fileSize: maxSize || config.maxSize || 10 * 1024 * 1024,
      },
    }).single(fieldName);
  }

  // Create array file handler
  static createArrayFileHandler(
    fieldName: FileFieldName,
    maxCount: number = 5,
    maxSize?: number
  ) {
    const config = FILE_UPLOAD_CONFIGS[fieldName];
    
    return multer({
      storage: this.getDiskStorage(),
      fileFilter: this.fileFilter,
      limits: {
        fileSize: maxSize || config.maxSize || 10 * 1024 * 1024,
      },
    }).array(fieldName, maxCount);
  }
}

// Convenience exports
export const uploadMultipleFiles = FileUploadMiddleware.createMultipleFileHandler();
export const uploadMultipleFilesMemory = FileUploadMiddleware.createMultipleFileHandler();

// Disk storage
export const uploadSingleImage = FileUploadMiddleware.createSingleFileHandler(FileFieldName.IMAGE);
export const uploadSingleDoc = FileUploadMiddleware.createSingleFileHandler(FileFieldName.DOC);
export const uploadSingleCVToDisk = FileUploadMiddleware.createSingleFileHandler(FileFieldName.CV);
export const uploadSingleCSVToDisk = FileUploadMiddleware.createSingleFileHandler(FileFieldName.CSV);
