import mongoose, { model, Schema } from 'mongoose';
import { TIngredient } from 'types/types';

export const ingredientSchema: Schema = new Schema<TIngredient>({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  proteins: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
  carbohydrates: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  image_mobile: {
    type: String,
    required: true,
  },
  image_large: {
    type: String,
    required: true,
  },
  __v: {
    type: Number,
  },
});

export default model<TIngredient>('ingredient', ingredientSchema);
