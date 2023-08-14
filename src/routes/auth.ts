import { Router } from 'express';
import {  createUser, forgotPassword, getUserInfo, login, logout, refreshToken, resetUserPassword, updateUserInfo } from '../controllers/auth';
import { checkAutMiddlware } from '../middlewares/auth-thunk';
import { validatEmail, validatResetPasswordBody, validateAuthentication, validateCreatedUserBody, validateUpdateUserBody } from '../validators';

const router = Router();

router.get('/auth/user', checkAutMiddlware, getUserInfo);

router.post('/auth/login', validateAuthentication, login);

router.post('/auth/register', validateCreatedUserBody, createUser);

router.post('/auth/logout', checkAutMiddlware, logout);

router.patch('/auth/user', validateUpdateUserBody, checkAutMiddlware, updateUserInfo);

router.post('/password-reset', validatEmail, forgotPassword);

router.post('/password-reset/reset', validatResetPasswordBody, resetUserPassword);

router.post('/auth/token', checkAutMiddlware, refreshToken);

export default router;