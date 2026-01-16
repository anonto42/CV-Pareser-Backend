import { Router } from 'express';
import { CvIngestionContainer } from './modules/cv-ingestion/infrastructure/di/cvIngestion.container';
import { ChatContainer } from './modules/cv-chat/infrastructure/di/chat.container';

export const Routes = (): Router => {
  const apiRouter = Router();

  [
    {
      path: '/cv-ingestion',
      route: CvIngestionContainer.createRouter(),
    },
    {
      path: '/chat',
      route: ChatContainer.getInstance().getChatRoutes(),
    },
  ].forEach(router => apiRouter.use(router.path, router.route));

  return apiRouter;
};
