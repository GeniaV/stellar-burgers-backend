import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { CustomError, TUser } from '../types/types';
import ConflictError from '../errors/conflict_error';
import BadRequestError from '../errors/bad_request_error';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../config';
import NotFoundError from '../errors/not_found_error';
import { EXPIRED_TOKEN_MS } from '../constants';
import { TestAccount } from 'nodemailer';

const { v4: uuidv4 } = require('uuid');

const nodemailer = require("nodemailer");

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
  User.findById(req.user.userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('User not found'));
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

// Sign in
export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', accessToken, {
        maxAge: EXPIRED_TOKEN_MS,
        httpOnly: true,
        sameSite: true,
      });
      res.send({
        accessToken: `Bearer ${accessToken}`,
        refreshToken,
        success: true,
        user: { email: user.email, name: user.name }
      });
    })
    .catch(next);
};

// Logout User
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send({
      message: "Successful logout",
      success: true
    });
  }
  catch (err) {
    next(err);
  }
};

// Update UserInfo
export const updateUserInfo = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body;

  User.findUserAndUpdateById(req.user.userId, { email, password, name })
    .then((user) => res.send({
      success: true,
      user: {
        name: user.name,
        email: user.email,
      }
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data passed when updating profile'));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('User is not found'));
      }
      next(err);
    });
};

// Forgot password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new NotFoundError('User not found'));
    }

    const token = uuidv4();

    user.passwordResetToken = token;

    await user.save();

    await new Promise<void>((resolve, reject) => {
      nodemailer.createTestAccount(async (err: Error | null, account: TestAccount) => {
        if (err) {
          reject(err);
        }

        console.log('Test account created: %s', account.user);
        console.log('Password: %s', account.pass);

        const transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          auth: {
            user: account.user,
            pass: account.pass
          }
        });

        const mailOptions = {
          to: user.email,
          from: 'passwordreset@example.com',
          subject: 'Password reset',
          text: `Your token for password reset: ${token}\n\nCopy this token and paste it into the appropriate field on the website to continue the password reset process.`,
        };

        transporter.sendMail(mailOptions, (error: Error | null) => {
          if (error) reject(error);
          resolve();
        });
      });
    });

    res.send({
      message: "Reset email sent",
      success: true
    });
  } catch (err) {
    return next(err);
  }
};

// Reset Password
export const resetUserPassword = (req: Request, res: Response, next: NextFunction) => {
  const { password, token } = req.body;

  bcrypt.hash(password, 10)
    .then(async (hash: string) => {
      const user = await User.findOneAndUpdate({ passwordResetToken: token }, { $set: { password: hash }, $unset: { passwordResetToken: "" } }, { new: true })
      if (!user) {
        return next(new NotFoundError('User not found'));
      }
      return res.send({
        message: "Password successfully reset",
        success: true
      });
    })
    .catch((err: Error) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data passed when reser password'));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('User is not found'));
      }
      next(err);
    });
}
