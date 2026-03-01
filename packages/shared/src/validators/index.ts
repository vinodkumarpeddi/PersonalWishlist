import { z } from 'zod';

// ============================================
// Auth Validators
// ============================================

export const verifyTokenSchema = z.object({
  firebaseToken: z.string().min(1, 'Firebase token is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// ============================================
// Phone Validators
// ============================================

export const phoneSchema = z
  .string()
  .regex(/^\+\d{1,3}\d{6,14}$/, 'Invalid phone number format');

export const countryCodeSchema = z
  .string()
  .regex(/^\+\d{1,3}$/, 'Invalid country code');

// ============================================
// Wishlist Validators
// ============================================

export const addWishlistItemSchema = z.object({
  url: z.string().url('Invalid URL'),
  targetPricePaise: z.number().int().positive().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
  notes: z.string().max(500).optional(),
  notifyOnPriceDrop: z.boolean().optional().default(true),
});

export const updateWishlistItemSchema = z.object({
  targetPricePaise: z.number().int().positive().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  notes: z.string().max(500).optional(),
  notifyOnPriceDrop: z.boolean().optional(),
});

export const wishlistQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(20),
  sortBy: z
    .enum(['addedAt', 'price_asc', 'price_desc', 'priority', 'name'])
    .optional()
    .default('addedAt'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  search: z.string().max(100).optional(),
});

// ============================================
// Product Validators
// ============================================

export const extractProductSchema = z.object({
  url: z.string().url('Invalid URL'),
});

// ============================================
// User Profile Validators
// ============================================

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
  currency: z.string().length(3).optional(),
  locale: z.string().max(10).optional(),
});

// ============================================
// Common Validators
// ============================================

export const mongoIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID');

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(20),
});
