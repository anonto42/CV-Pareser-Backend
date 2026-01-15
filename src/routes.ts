import { Router } from 'express';
import { CvIngestionContainer } from './modules/cv-ingestion/infrastructure/di/cvIngestion.container';

export const Routes = (): Router => {
  const apiRouter = Router();

  [
    {
      path: '/cv-ingestion',
      route: CvIngestionContainer.createRouter(),
    },
  ].forEach(router => apiRouter.use(router.path, router.route));

  return apiRouter;
};
