import { NextFunction, Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR_STATUS_CODE } from '../constants';

interface IError extends Error {
  statusCode: number;
};

const errorHandler = ((err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = INTERNAL_SERVER_ERROR_STATUS_CODE, message } = err;
  res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER_ERROR_STATUS_CODE
      ? 'Error on the server'
      : message,
  });
  next();
});

export default errorHandler;
