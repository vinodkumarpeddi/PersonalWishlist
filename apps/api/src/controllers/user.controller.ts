import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import type { ApiResponse } from '@wishpal/shared';

export class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getProfile(req.userId!);
      res.json({ success: true, data: user } as ApiResponse);
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.updateProfile(req.userId!, req.body);
      res.json({ success: true, data: user } as ApiResponse);
    } catch (err) {
      next(err);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await userService.getStats(req.userId!);
      res.json({ success: true, data: stats } as ApiResponse);
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
