import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const notFoundApiErrorHandler = (req: Request, res: Response) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API DOESN'T EXIST",
      },
    ],
  });
};

export default notFoundApiErrorHandler;
