import { Router, type Router as RouterType } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { authLimiter } from '../middleware/rate-limit';
import { verifyTokenSchema, refreshTokenSchema } from '@wishpal/shared';

const router: RouterType = Router();

router.post(
  '/verify-token',
  authLimiter,
  validate(verifyTokenSchema),
  (req, res, next) => authController.verifyToken(req, res, next),
);

router.post(
  '/refresh-token',
  authLimiter,
  validate(refreshTokenSchema),
  (req, res, next) => authController.refreshToken(req, res, next),
);

router.post(
  '/logout',
  authenticate,
  (req, res, next) => authController.logout(req, res, next),
);

export { router as authRouter };
