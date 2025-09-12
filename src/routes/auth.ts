import { Router } from 'express';
import {
  register,
  login,
  me,
  logout,
  sendVerification,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
} from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, me);
router.post('/logout', authMiddleware, logout);

router.post('/send-verification', sendVerification);
router.post('/verify-email', verifyEmail);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
