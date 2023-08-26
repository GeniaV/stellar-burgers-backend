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
  __v: number,
  _id?: mongoose.Types.ObjectId,
};

export type TUser = {
  _id?: mongoose.Types.ObjectId,
  name: string,
  email: string,
  password: string,
  passwordResetToken?: string | null,
  createdAt: string,
  updatedAt: string
};

export interface CustomError {
  code?: number;
  name?: string;
};

export type TOrderDetails = {
  createdAt: string,
  name: string,
  number: number,
  price: number,
  status: string,
  updatedAt: string,
  _id?: string,
  ingredients: TIngredient[],
  owner: {
    createdAt: string,
    email: string,
    name: string,
    updatedAt: string,
    ownerId?: string
  },
};
