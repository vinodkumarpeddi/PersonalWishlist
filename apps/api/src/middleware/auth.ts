import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { ApiError } from '../utils/api-error';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userPhone?: string;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next(ApiError.unauthorized('No token provided'));
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = authService.verifyAccessToken(token);
    req.userId = payload.userId;
    req.userPhone = payload.phone;
    next();
  } catch (err) {
    next(err);
  }
}
