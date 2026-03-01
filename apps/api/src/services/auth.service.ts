import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getFirebaseAdmin } from '../config/firebase';
import { UserModel, type IUser } from '../models/user.model';
import { RefreshTokenModel } from '../models/refresh-token.model';
import { env } from '../config/env';
import { ApiError } from '../utils/api-error';
import { APP_CONSTANTS } from '@wishpal/shared';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface JwtPayload {
  userId: string;
  phone: string;
}

export class AuthService {
  async verifyFirebaseToken(firebaseToken: string): Promise<{ user: IUser; tokens: TokenPair }> {
    let phone: string;
    let firebaseUid: string;

    try {
      const admin = getFirebaseAdmin();
      const decoded = await admin.auth().verifyIdToken(firebaseToken);
      phone = decoded.phone_number || '';
      firebaseUid = decoded.uid;
    } catch {
      // In development without Firebase config, accept a mock token
      if (env.isDev && firebaseToken === 'mock-firebase-token') {
        phone = '+919999999999';
        firebaseUid = 'dev-mock-uid';
      } else {
        throw ApiError.unauthorized('Invalid Firebase token');
      }
    }

    if (!phone) {
      throw ApiError.badRequest('Phone number not found in token');
    }

    // Find or create user
    let user = await UserModel.findOne({ firebaseUid });

    if (!user) {
      user = await UserModel.create({
        firebaseUid,
        phone,
        countryCode: '+91',
      });
    }

    const tokens = await this.generateTokenPair(user);

    return { user, tokens };
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const stored = await RefreshTokenModel.findOne({ token: refreshToken });

    if (!stored) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    if (stored.expiresAt < new Date()) {
      await RefreshTokenModel.deleteOne({ _id: stored._id });
      throw ApiError.unauthorized('Refresh token expired');
    }

    // Rotate: delete old token
    await RefreshTokenModel.deleteOne({ _id: stored._id });

    const user = await UserModel.findById(stored.userId);
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    return this.generateTokenPair(user);
  }

  async logout(userId: string): Promise<void> {
    await RefreshTokenModel.deleteMany({ userId });
  }

  private async generateTokenPair(user: IUser): Promise<TokenPair> {
    const payload: JwtPayload = {
      userId: user._id.toString(),
      phone: user.phone,
    };

    const accessToken = jwt.sign(payload, env.jwtSecret, {
      expiresIn: APP_CONSTANTS.ACCESS_TOKEN_EXPIRY,
    });

    const refreshTokenValue = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + APP_CONSTANTS.REFRESH_TOKEN_EXPIRY_DAYS);

    await RefreshTokenModel.create({
      userId: user._id,
      token: refreshTokenValue,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken: refreshTokenValue,
    };
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.jwtSecret) as JwtPayload;
    } catch {
      throw ApiError.unauthorized('Invalid or expired access token');
    }
  }
}

export const authService = new AuthService();
