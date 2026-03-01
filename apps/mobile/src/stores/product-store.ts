import { create } from 'zustand';
import { apiClient } from '../services/api-client';
import type { Product, ScrapeStatus } from '@wishpal/shared';

interface ProductState {
  extractedProduct: Product | null;
  extractionStatus: ScrapeStatus | 'idle';
  extractionError: string | null;

  extractProduct: (url: string) => Promise<void>;
  clearExtraction: () => void;
  addToWishlist: (options: {
    targetPricePaise?: number;
    priority?: string;
    notes?: string;
  }) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  extractedProduct: null,
  extractionStatus: 'idle',
  extractionError: null,

  extractProduct: async (url) => {
    set({ extractionStatus: 'processing', extractionError: null, extractedProduct: null });

    try {
      const { data } = await apiClient.post<{ data: Product }>('/products/extract', { url });
      set({ extractedProduct: data.data, extractionStatus: 'completed' });
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? ((err as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message ?? 'Extraction failed')
          : 'Network error';
      set({ extractionStatus: 'failed', extractionError: message });
    }
  },

  clearExtraction: () => {
    set({ extractedProduct: null, extractionStatus: 'idle', extractionError: null });
  },

  addToWishlist: async (options) => {
    const product = get().extractedProduct;
    if (!product) return;

    await apiClient.post('/wishlist/items', {
      productId: product._id,
      ...options,
    });
  },
}));
