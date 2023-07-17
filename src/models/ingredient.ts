import { model, Schema } from 'mongoose';
import { type } from 'os';
import { TIngredient } from 'types/types';

const ingredientSchema: Schema = new Schema<TIngredient>({
  name: {
    type: String,
    required: true,
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
  }
});

export default model<TIngredient>('ingredient', ingredientSchema);
