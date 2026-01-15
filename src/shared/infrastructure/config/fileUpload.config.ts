import { FileFieldName, FileUploadConfig } from "../../types/fileUpload.types";

export const FILE_UPLOAD_CONFIGS: Record<FileFieldName, FileUploadConfig> = {
  [FileFieldName.IMAGE]: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    destination: 'uploads/images',
  },
  [FileFieldName.MEDIA]: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: ['video/mp4', 'audio/mpeg', 'audio/mp3'],
    allowedExtensions: ['.mp4', '.mp3', '.mpeg'],
    destination: 'uploads/media',
  },
  [FileFieldName.DOC]: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['application/pdf', 'application/msword'],
    allowedExtensions: ['.pdf', '.doc', '.docx'],
    destination: 'uploads/docs',
  },
  [FileFieldName.CV]: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    destination: 'uploads/cvs',
  },
  [FileFieldName.CSV]: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['text/csv', 'application/vnd.ms-excel'],
    allowedExtensions: ['.csv'],
    destination: 'uploads/csvs',
  },
};