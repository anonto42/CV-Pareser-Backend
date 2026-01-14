import { Router } from 'express';
import { TestController } from '../../hexagons/test/testController';

export const Routes = (): Router => {
  const apiRouter = Router();

  // Defiend endpoients
  [
    {
      path: '/test',
      route: TestController.getRouter(),
    },
  ].forEach(router => apiRouter.use(router.path, router.route));

  return apiRouter;
};
