import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service';
import type { ApiResponse } from '@wishpal/shared';

export class ProductController {
  async extract(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { url } = req.body;
      const product = await productService.extractAndSave(url);

      const response: ApiResponse = {
        success: true,
        data: product,
      };

      res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async getPriceHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const history = await productService.getPriceHistory(req.params.productId as string);
      res.json({ success: true, data: history } as ApiResponse);
    } catch (err) {
      next(err);
    }
  }
}

export const productController = new ProductController();
