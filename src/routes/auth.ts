import { Router } from 'express';
import {  createUser, getUserInfo, login } from '../controllers/auth';

const router = Router();

router.get('/auth/user', getUserInfo);

router.post('/auth/login', login);

router.post('/auth/register', createUser);

export default router;