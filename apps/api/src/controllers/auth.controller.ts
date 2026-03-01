import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import type { ApiResponse, AuthResponse, RefreshTokenResponse } from '@wishpal/shared';

export class AuthController {
  async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firebaseToken } = req.body;
      const { user, tokens } = await authService.verifyFirebaseToken(firebaseToken);

      const response: ApiResponse<AuthResponse> = {
        success: true,
        data: {
          user: {
            _id: user._id.toString(),
            firebaseUid: user.firebaseUid,
            phone: user.phone,
            countryCode: user.countryCode,
            name: user.name,
            avatarUrl: user.avatarUrl,
            currency: user.currency,
            locale: user.locale,
            onboardingCompleted: user.onboardingCompleted,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
          },
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      };

      res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshTokens(refreshToken);

      const response: ApiResponse<RefreshTokenResponse> = {
        success: true,
        data: tokens,
      };

      res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.logout(req.userId!);
      const response: ApiResponse = { success: true };
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
