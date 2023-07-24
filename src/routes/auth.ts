import { Router } from 'express';
import {  createUser, getUserInfo } from '../controllers/auth';

const router = Router();

router.get('/auth/user', getUserInfo)

router.post('/auth/register', createUser);

export default router;