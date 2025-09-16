import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  registerSchema,
  loginSchema,
  otpSchema,
  resetPasswordSchema,
} from '../validators/auth.validators';
import { rateLimit } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post(
  '/login',
  rateLimit({ keyPrefix: 'login', windowDurationInSeconds: 600, maxRequestsPerWindow: 5 }),
  validate(loginSchema),
  authController.login
);

router.post('/logout', authMiddleware, authController.logout);

router.post(
  '/send-verification',
  rateLimit({ keyPrefix: 'otp', windowDurationInSeconds: 600, maxRequestsPerWindow: 5 }),
  validate(otpSchema.pick({ email: true })),
  authController.sendVerification
);
router.post('/verify', validate(otpSchema), authController.verifyEmail);

router.post(
  '/request-password-reset',
  validate(otpSchema.pick({ email: true })),
  authController.requestPasswordReset
);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

router.get('/me', authMiddleware, authController.me);

export default router;
