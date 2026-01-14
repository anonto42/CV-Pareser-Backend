import express, { Application } from 'express';
import cors from 'cors';

import { Routes } from './routes';
import globalErrorHandler from '../middlewares/globalErrorHandler';
import notFoundApiErrorHandler from '../middlewares/apiNotFoundErrorHandler';

export const createApp = (): Application => {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Routes
  app.use('/api/v1', Routes());

  // Global error handler
  app.use(globalErrorHandler);

  // Url not found error handler
  app.use(notFoundApiErrorHandler);

  return app;
};
