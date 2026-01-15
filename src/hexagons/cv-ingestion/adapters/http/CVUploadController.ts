import { Router, Request, Response } from 'express';

export class CvIngestionController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.route('/by-pdf').get(this.testEndpoint);
    this.router.route('/by-link').get(this.testEndpoint);
    this.router.route('/by-csv').get(this.testEndpoint);
  }

  private testEndpoint = (req: Request, res: Response): void => {
    res.send('Test');
  };

  public static getRouter(): Router {
    return new CvIngestionController().router;
  }
}
