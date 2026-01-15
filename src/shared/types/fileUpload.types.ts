export enum FileFieldName {
  IMAGE = 'image',
  MEDIA = 'media',
  DOC = 'doc',
  CV = 'cv',
  CSV = 'csv',
}

export interface FileUploadConfig {
  maxSize?: number;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
  destination: string;
}

export interface MulterFieldConfig {
  name: string;
  maxCount: number;
}