import { Router } from 'express';
import {
  login,
  logout,
  register,
  profile,
  requestPasswordReset,
  resetPassword,
} from '../controllers/auth.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.get('/profile', authRequired, profile);

router.post('/request-password-reset', requestPasswordReset);

router.post('/reset-password', resetPassword);

export default router;
