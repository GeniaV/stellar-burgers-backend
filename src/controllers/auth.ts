import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { CustomError, TUser } from '../types/types';
import ConflictError from '../errors/conflict_error';
import BadRequestError from '../errors/bad_request_error';

const bcrypt = require('bcrypt');

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash: string) => User.create(
      { name, email, password: hash },
    ))
    .then((user: TUser) => res.send({ data: user }))
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