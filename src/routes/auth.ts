import { Router } from 'express';
import {  createUser } from '../controllers/auth';

const router = Router();

router.post('/auth/register', createUser);

export default router;