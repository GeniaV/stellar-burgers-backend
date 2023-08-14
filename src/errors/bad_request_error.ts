import { BAD_REQUEST_ERROR_STATUS_CODE } from '../constants';

class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = BAD_REQUEST_ERROR_STATUS_CODE;
  }
}

export default BadRequestError;
