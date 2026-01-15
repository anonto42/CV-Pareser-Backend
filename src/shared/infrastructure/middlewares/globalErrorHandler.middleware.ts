import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { IErrorMessage } from '../../types/errorMessage.type';
import zodError from '../error/zod.error';
import config from '../config';
import ApiError from '../error/api.error';

const globalErrorHandler: ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Something went wrong';
  let errorMessages: IErrorMessage[] = [];

  if (error.name === 'ZodError') {
    const simplifiedError = zodError(error);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessages = error.message
      ? [
          {
            path: '',
            message: error.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error.message;
    errorMessages = error.message
      ? [
          {
            path: '',
            message: error.message,
          },
        ]
      : [];
  }

  if (config.server.node_env !== 'production') {
    console.error('❌ Error:', {
      statusCode,
      message,
      stack: error?.stack,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.server.node_env !== 'production' ? error?.stack : undefined,
  });
};

export default globalErrorHandler;