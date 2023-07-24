import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { CustomError, TUser } from '../types/types';
import ConflictError from '../errors/conflict_error';
import BadRequestError from '../errors/bad_request_error';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, JWT_SECRET } from '../config';
import UnauthorizedError from '../errors/unauthorized_error';
import { ObjectId } from 'mongoose';
import NotFoundError from '../errors/not_found_error';

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

// Sign up
export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash: string) => User.create(
      { name, email, password: hash },
    ))
    .then((user: TUser) => {
      const accessToken = jwt.sign({ userId: user._id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ userId: user._id, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
      res.send({
        accessToken: `Bearer ${accessToken}`,
        refreshToken,
        success: true,
        user: { email: user.email, name: user.name }
      });
    })
    .catch((err: CustomError) => {
      if (err.code === 11000) {
        next(new ConflictError('User has been already exist'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Incorrect data provided when creating a user'));
      }
      next(err);
    });
};

// Get user
export const getUserInfo = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('User is not authorized');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError('User is not authorized');
  }

  req.user = payload;

  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('User not found'));
      }
      return res.send({
        success: true,
        user: { email: user?.email, name: user?.name }
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('User with the specified _id not found'));
      } else {
        next(err);
      }
    });
};
