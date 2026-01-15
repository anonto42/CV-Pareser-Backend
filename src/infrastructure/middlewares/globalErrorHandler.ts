import { ErrorRequestHandler } from 'express';
import config from '../../shared/infrastructure/config';
import { IErrorMessage } from '../../shared/types/errors.types';
import ApiError from '../error/apiError';
import handleZodError from '../error/zodError';

const globalErrorHandler: ErrorRequestHandler = (error, req, res,) => {
  let statusCode = 500;
  let message = 'Something went wrong';
  let errorMessages: IErrorMessage[] = [];

  if (error.name === 'ZodError') {
    const simplifiedError = handleZodError(error);

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
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.server.node_env !== 'production' ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
