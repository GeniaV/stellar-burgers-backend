import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from '../constants';

const allowedCors = [
  'http://localhost:3000',
  'https://localhost:3000',
];

const accessControlAllowMiddlware = (req: Request, res: Response, next: NextFunction) => {
  const { origin } = req.headers;
  const accessControlRequestHeaders = req.headers['access-control-request-headers'];

  if (origin && allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Content-type', 'application/json; charset=UTF-8');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, ' + accessControlRequestHeaders);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, ' + accessControlRequestHeaders);
    res.sendStatus(StatusCodes.OK);
  } else {
    next();
  }
};

export default accessControlAllowMiddlware;