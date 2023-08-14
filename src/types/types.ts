import mongoose from 'mongoose';

export type TIngredient = {
  name: string,
  type: 'bun' | 'main' | 'sauce',
  proteins: number,
  fat: number,
  carbohydrates: number,
  calories: number,
  price: number,
  image: string;
  image_mobile: string;
  image_large: string;
};

export type TUser = {
  _id?: mongoose.Types.ObjectId,
  name: string,
  email: string,
  password: string,
  passwordResetToken?: string | null,
};

export interface CustomError {
  code?: number;
  name?: string;
};
