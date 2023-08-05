import { Request, Response, NextFunction } from 'express';

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
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, ' + accessControlRequestHeaders);
    res.sendStatus(200);
  } else {
    next();
  }
};

export default accessControlAllowMiddlware;
