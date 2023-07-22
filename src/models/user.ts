import {
  model,
  Schema,
  Model,
  Document,
} from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import UnauthorizedError from '../errors/unauthorized_error';
import { TUser } from '../types/types';

interface IUserModel extends Model<TUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<Document<TUser>>;
}

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

userSchema.index({ email: 1 }, { unique: true });

export default model<TUser, IUserModel>('user', userSchema);