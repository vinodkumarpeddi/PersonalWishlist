import { Router, type Router as RouterType } from 'express';
import { productController } from '../controllers/product.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { scrapeLimiter } from '../middleware/rate-limit';
import { extractProductSchema } from '@wishpal/shared';

const router: RouterType = Router();

router.use(authenticate);

router.post(
  '/extract',
  scrapeLimiter,
  validate(extractProductSchema),
  (req, res, next) => productController.extract(req, res, next),
);

router.get(
  '/:productId/price-history',
  (req, res, next) => productController.getPriceHistory(req, res, next),
);

export { router as productRouter };
