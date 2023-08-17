import { Router } from 'express';
import { checkAutMiddlware } from '../middlewares/auth-thunk';
import { putAnOrder } from '../controllers/orders';

const router = Router();

router.post('/orders', checkAutMiddlware, putAnOrder);

export default router;