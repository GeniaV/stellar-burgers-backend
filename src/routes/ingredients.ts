import { Router } from 'express';
import { getIngredients } from '../controllers/ingredients';

const router = Router();

router.get('/ingredients', getIngredients);

export default router;
