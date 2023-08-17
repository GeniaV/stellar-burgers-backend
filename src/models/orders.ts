import { model, Schema } from 'mongoose';
import { TOrderDetails } from 'types/types';
import { ingredientSchema } from './ingredient';

const orderDetailsSchema = new Schema<TOrderDetails>({
  name: {
    type: String,
  },
  number: {
    type: Number,
  },
  price: {
    type: Number,
  },
  status: { type: String, default: 'in process' },
  ingredients: [ingredientSchema],
  owner: {
    createdAt: {
      type: Date,
    },
    email: {
      type: String,
    },
    name: {
      type: String,
    },
    updatedAt: {
      type: Date,
    },
  },
},
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    versionKey: false
  });

export default model<TOrderDetails>('order', orderDetailsSchema);
