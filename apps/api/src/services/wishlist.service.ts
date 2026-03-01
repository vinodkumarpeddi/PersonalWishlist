import { WishlistItemModel } from '../models/wishlist-item.model';
import { ProductModel } from '../models/product.model';
import { ApiError } from '../utils/api-error';
import type { SortBy, PaginatedResponse, WishlistItem } from '@wishpal/shared';

interface WishlistQuery {
  page: number;
  limit: number;
  sortBy: SortBy;
  priority?: string;
  search?: string;
}

function buildSort(sortBy: SortBy): Record<string, 1 | -1> {
  switch (sortBy) {
    case 'price_asc':
      return { 'product.currentPricePaise': 1 };
    case 'price_desc':
      return { 'product.currentPricePaise': -1 };
    case 'priority':
      return { priority: -1, addedAt: -1 };
    case 'name':
      return { 'product.title': 1 };
    case 'addedAt':
    default:
      return { addedAt: -1 };
  }
}

export class WishlistService {
  async getWishlist(userId: string, query: WishlistQuery): Promise<PaginatedResponse<WishlistItem>> {
    const { page, limit, sortBy, priority, search } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { userId };
    if (priority) filter.priority = priority;

    const items = await WishlistItemModel.find(filter)
      .populate('productId')
      .sort(buildSort(sortBy))
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await WishlistItemModel.countDocuments(filter);

    const data = items
      .filter((item) => {
        if (!search) return true;
        const product = item.productId as unknown as Record<string, string>;
        return product?.title?.toLowerCase().includes(search.toLowerCase());
      })
      .map((item) => {
        const product = item.productId as unknown as Record<string, unknown>;
        return {
          _id: item._id.toString(),
          userId: item.userId.toString(),
          productId: (product?._id || item.productId).toString(),
          product: product
            ? {
                ...product,
                _id: (product._id as { toString(): string }).toString(),
                lastScrapedAt: (product.lastScrapedAt as Date)?.toISOString?.() || '',
                createdAt: (product.createdAt as Date)?.toISOString?.() || '',
                updatedAt: (product.updatedAt as Date)?.toISOString?.() || '',
              }
            : undefined,
          targetPricePaise: item.targetPricePaise,
          priority: item.priority,
          notes: item.notes,
          notifyOnPriceDrop: item.notifyOnPriceDrop,
          addedAt: item.addedAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
        } as WishlistItem;
      });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  async addItem(
    userId: string,
    productId: string,
    options: { targetPricePaise?: number; priority?: string; notes?: string; notifyOnPriceDrop?: boolean },
  ) {
    const product = await ProductModel.findById(productId);
    if (!product) throw ApiError.notFound('Product not found');

    const existing = await WishlistItemModel.findOne({ userId, productId });
    if (existing) throw ApiError.conflict('Product already in your wishlist');

    const item = await WishlistItemModel.create({
      userId,
      productId,
      ...options,
    });

    return item.populate('productId');
  }

  async getItem(userId: string, itemId: string) {
    const item = await WishlistItemModel.findOne({ _id: itemId, userId }).populate('productId');
    if (!item) throw ApiError.notFound('Wishlist item not found');
    return item;
  }

  async updateItem(
    userId: string,
    itemId: string,
    updates: { targetPricePaise?: number; priority?: string; notes?: string; notifyOnPriceDrop?: boolean },
  ) {
    const item = await WishlistItemModel.findOneAndUpdate(
      { _id: itemId, userId },
      { $set: updates },
      { new: true },
    ).populate('productId');

    if (!item) throw ApiError.notFound('Wishlist item not found');
    return item;
  }

  async deleteItem(userId: string, itemId: string) {
    const item = await WishlistItemModel.findOneAndDelete({ _id: itemId, userId });
    if (!item) throw ApiError.notFound('Wishlist item not found');
  }
}

export const wishlistService = new WishlistService();
