import { Request, Response, NextFunction } from 'express';
import { wishlistService } from '../services/wishlist.service';
import type { ApiResponse } from '@wishpal/shared';

export class WishlistController {
  async getWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await wishlistService.getWishlist(req.userId!, req.query as any);
      res.json({ success: true, data: result } as ApiResponse);
    } catch (err) {
      next(err);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // At this point, the product should already exist from the scraper
      // The frontend sends productId after extraction
      const { productId, targetPricePaise, priority, notes, notifyOnPriceDrop } = req.body;

      const item = await wishlistService.addItem(req.userId!, productId, {
        targetPricePaise,
        priority,
        notes,
        notifyOnPriceDrop,
      });

      res.status(201).json({ success: true, data: item } as ApiResponse);
    } catch (err) {
      next(err);
    }
  }

  async getItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await wishlistService.getItem(req.userId!, req.params.id as string);
      res.json({ success: true, data: item } as ApiResponse);
    } catch (err) {
      next(err);
    }
  }

  async updateItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await wishlistService.updateItem(req.userId!, req.params.id as string, req.body);
      res.json({ success: true, data: item } as ApiResponse);
    } catch (err) {
      next(err);
    }
  }

  async deleteItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await wishlistService.deleteItem(req.userId!, req.params.id as string);
      res.json({ success: true } as ApiResponse);
    } catch (err) {
      next(err);
    }
  }
}

export const wishlistController = new WishlistController();
