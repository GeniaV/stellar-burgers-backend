import { Request, Response, NextFunction } from 'express';
import Ingredient from '../models/ingredient';

export const getIngredients = (req: Request, res: Response, next: NextFunction) => Ingredient.find({})
  .then((ingredients) => res.send({
    success: true,
    data: ingredients
  }))
  .catch(next);