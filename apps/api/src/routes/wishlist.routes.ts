import { Router, type Router as RouterType } from 'express';
import { wishlistController } from '../controllers/wishlist.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { wishlistQuerySchema, updateWishlistItemSchema } from '@wishpal/shared';

const router: RouterType = Router();

// All wishlist routes require authentication
router.use(authenticate);

router.get(
  '/',
  validate(wishlistQuerySchema, 'query'),
  (req, res, next) => wishlistController.getWishlist(req, res, next),
);

router.post(
  '/items',
  (req, res, next) => wishlistController.addItem(req, res, next),
);

router.get(
  '/items/:id',
  (req, res, next) => wishlistController.getItem(req, res, next),
);

router.patch(
  '/items/:id',
  validate(updateWishlistItemSchema),
  (req, res, next) => wishlistController.updateItem(req, res, next),
);

router.delete(
  '/items/:id',
  (req, res, next) => wishlistController.deleteItem(req, res, next),
);

export { router as wishlistRouter };
