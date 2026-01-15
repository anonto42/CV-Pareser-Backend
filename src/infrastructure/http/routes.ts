import { Router } from 'express';
import { CvIngestionController } from '../../hexagons/cv-ingestion/adapters/http/CVUploadController';

export const Routes = (): Router => {
  const apiRouter = Router();

  // Defiend endpoients
  [
    {
      path: '/cv-ingestion',
      route: CvIngestionController.getRouter(),
    },
  ].forEach(router => apiRouter.use(router.path, router.route));

  return apiRouter;
};
 