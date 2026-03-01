import { Router, type Router as RouterType } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateProfileSchema } from '@wishpal/shared';

const router: RouterType = Router();

router.use(authenticate);

router.get(
  '/profile',
  (req, res, next) => userController.getProfile(req, res, next),
);

router.patch(
  '/profile',
  validate(updateProfileSchema),
  (req, res, next) => userController.updateProfile(req, res, next),
);

router.get(
  '/stats',
  (req, res, next) => userController.getStats(req, res, next),
);

export { router as userRouter };
