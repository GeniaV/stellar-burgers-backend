import { Router } from 'express';
import {  createUser, forgotPassword, getUserInfo, login, logout, refreshToken, resetUserPassword, updateUserInfo } from '../controllers/auth';
import { checkAutMiddlware } from '../middlewares/auth-thunk';

const router = Router();

router.get('/auth/user', checkAutMiddlware, getUserInfo);

router.post('/auth/login', login);

router.post('/auth/register', createUser);

router.post('/auth/logout', checkAutMiddlware, logout);

router.patch('/auth/user', checkAutMiddlware, updateUserInfo);

router.post('/password-reset', forgotPassword);

router.post('/password-reset/reset', resetUserPassword);

router.post('/auth/token', checkAutMiddlware, refreshToken);

export default router;