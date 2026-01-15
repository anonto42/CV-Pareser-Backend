import express, { Application } from 'express';
import cors from 'cors';

import { Routes } from './routes';
import globalErrorHandler from './shared/infrastructure/middlewares/globalErrorHandler.middleware';
import notFoundApiErrorHandler from './shared/infrastructure/middlewares/apiNotFoundErrorHandler.middleware';
import { FileUploadMiddleware } from './shared/infrastructure/middlewares/fileUpload.middleware';

export const createApp = (): Application => {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //file retrieve
  app.use(express.static('uploads'));

  // Health check
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Initialize upload directories
  FileUploadMiddleware.initializeDirectories();

  // Routes
  app.use('/api/v1', Routes());

  // Global error handler
  app.use(globalErrorHandler);

  // Url not found error handler
  app.use(notFoundApiErrorHandler);

  return app;
};
