import { ACCESS_TOKEN_SECRET } from '../config';
import UnauthorizedError from '../errors/not_found_error';
import { Request, Response, NextFunction } from 'express';

const jwt = require('jsonwebtoken');

export const checkAutMiddlware = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('User is not authorized');
  }

  const userToken = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(userToken, ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new UnauthorizedError('User is not authorized');
  }

  req.user = payload;
  return next();
}

export const getUserIdFromToken = (token: string): string | null => {
  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return payload.userId;
  } catch (error) {
    return null;
  }
}