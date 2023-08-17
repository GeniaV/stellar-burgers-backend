import {
  model,
  Schema,
  Model,
  ObjectId,
} from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import UnauthorizedError from '../errors/unauthorized_error';
import { TUser } from '../types/types';
import NotFoundError from '../errors/not_found_error';

interface IUserModel extends Model<TUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<TUser>;
  findUserAndUpdateById: (
    userId: ObjectId,
    params: { email?: string, password?: string, name?: string }
  ) => Promise<TUser>;
};

const userSchema = new Schema<TUser, IUserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator(v: string) {
        return isEmail(v);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  passwordResetToken: {
    type: String,
    required: false
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  versionKey: false
});

const bcrypt = require('bcrypt');

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Wrong email or password');
      }
      return bcrypt.compare(password, user.password)
        .then((matched: boolean) => {
          if (!matched) {
            throw new UnauthorizedError('Wrong email or password');
          }
          return user;
        });
    });
});

userSchema.static('findUserAndUpdateById', async function findUserAndUpdateById(
  userId: ObjectId,
  params: { email?: string, password?: string, name?: string },
) {

  const user = await this.findById(userId);

  if (!user) {
    throw new NotFoundError('User is not found');
  }

  params.password = (params.password || params.password !== '')
    ? await bcrypt.hash(params.password, 10)
    : user.password;

  return this.findByIdAndUpdate(
    userId,
    params,
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return user;
    });
});

userSchema.index({ email: 1 }, { unique: true });

export default model<TUser, IUserModel>('user', userSchema);