import { Router } from 'express';
import {  createUser, getUserInfo, login, logout } from '../controllers/auth';
import { checkAutMiddlware } from '../middlewares/auth-thunk';

const router = Router();

router.get('/auth/user', checkAutMiddlware, getUserInfo);

router.post('/auth/login', login);

router.post('/auth/register', createUser);

router.post('/auth/logout', checkAutMiddlware, logout);

export default router;