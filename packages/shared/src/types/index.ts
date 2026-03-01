// ============================================
// Domain Models
// ============================================

export interface User {
  _id: string;
  firebaseUid: string;
  phone: string;
  countryCode: string;
  name?: string;
  avatarUrl?: string;
  currency: string;
  locale: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  url: string;
  normalizedUrl: string;
  domain: string;
  title: string;
  description?: string;
  imageUrl?: string;
  images: string[];
  currentPricePaise: number;
  originalPricePaise?: number;
  currency: string;
  inStock: boolean;
  brand?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  metadata: Record<string, unknown>;
  lastScrapedAt: string;
  scrapeStatus: ScrapeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  _id: string;
  userId: string;
  productId: string;
  product?: Product;
  targetPricePaise?: number;
  priority: Priority;
  notes?: string;
  notifyOnPriceDrop: boolean;
  addedAt: string;
  updatedAt: string;
}

export interface PriceHistory {
  _id: string;
  productId: string;
  pricePaise: number;
  currency: string;
  inStock: boolean;
  recordedAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  productId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

export interface RefreshToken {
  _id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

// ============================================
// Enums & Constants
// ============================================

export type ScrapeStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type NotificationType = 'price_drop' | 'back_in_stock' | 'target_reached' | 'system';

export type ViewMode = 'list' | 'grid';

export type SortBy = 'addedAt' | 'price_asc' | 'price_desc' | 'priority' | 'name';

export const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'urgent'];

export const SORT_OPTIONS: { label: string; value: SortBy }[] = [
  { label: 'Recently Added', value: 'addedAt' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Priority', value: 'priority' },
  { label: 'Name', value: 'name' },
];

// ============================================
// API Request/Response Types
// ============================================

// Auth
export interface VerifyTokenRequest {
  firebaseToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Wishlist
export interface AddWishlistItemRequest {
  url: string;
  targetPricePaise?: number;
  priority?: Priority;
  notes?: string;
  notifyOnPriceDrop?: boolean;
}

export interface UpdateWishlistItemRequest {
  targetPricePaise?: number;
  priority?: Priority;
  notes?: string;
  notifyOnPriceDrop?: boolean;
}

export interface WishlistQueryParams {
  page?: number;
  limit?: number;
  sortBy?: SortBy;
  priority?: Priority;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Product Extraction
export interface ExtractProductRequest {
  url: string;
}

export interface ExtractProductResponse {
  jobId: string;
  status: ScrapeStatus;
}

export interface ExtractJobStatus {
  jobId: string;
  status: ScrapeStatus;
  product?: Product;
  error?: string;
}

// User Profile
export interface UpdateProfileRequest {
  name?: string;
  avatarUrl?: string;
  currency?: string;
  locale?: string;
}

// Generic API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// ============================================
// App Constants
// ============================================

export const APP_CONSTANTS = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY_DAYS: 30,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 50,
  DEFAULT_CURRENCY: 'INR',
  DEFAULT_LOCALE: 'en-IN',
  DEFAULT_COUNTRY_CODE: '+91',
  PRICE_CHECK_INTERVAL_HOURS: 6,
  MAX_WISHLIST_ITEMS: 100,
  OTP_LENGTH: 6,
} as const;
