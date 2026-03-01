import { create } from 'zustand';
import { apiClient } from '../services/api-client';
import type { WishlistItem, PaginatedResponse, SortBy, Priority, ViewMode } from '@wishpal/shared';

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  page: number;
  hasMore: boolean;
  total: number;
  sortBy: SortBy;
  filterPriority: Priority | undefined;
  searchQuery: string;
  viewMode: ViewMode;

  fetchItems: (refresh?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  setSortBy: (sortBy: SortBy) => void;
  setFilterPriority: (priority: Priority | undefined) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: ViewMode) => void;
  removeItem: (itemId: string) => Promise<void>;
  updateItem: (itemId: string, updates: Partial<WishlistItem>) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: false,
  isRefreshing: false,
  page: 1,
  hasMore: true,
  total: 0,
  sortBy: 'addedAt',
  filterPriority: undefined,
  searchQuery: '',
  viewMode: 'list',

  fetchItems: async (refresh = false) => {
    const { sortBy, filterPriority, searchQuery } = get();
    set(refresh ? { isRefreshing: true } : { isLoading: true });

    try {
      const params: Record<string, unknown> = {
        page: 1,
        limit: 20,
        sortBy,
      };
      if (filterPriority) params.priority = filterPriority;
      if (searchQuery) params.search = searchQuery;

      const { data } = await apiClient.get<{ data: PaginatedResponse<WishlistItem> }>('/wishlist', {
        params,
      });

      set({
        items: data.data.data,
        page: 1,
        hasMore: data.data.pagination.hasMore,
        total: data.data.pagination.total,
        isLoading: false,
        isRefreshing: false,
      });
    } catch {
      set({ isLoading: false, isRefreshing: false });
    }
  },

  loadMore: async () => {
    const { hasMore, page, isLoading, sortBy, filterPriority, searchQuery, items } = get();
    if (!hasMore || isLoading) return;

    set({ isLoading: true });

    try {
      const params: Record<string, unknown> = {
        page: page + 1,
        limit: 20,
        sortBy,
      };
      if (filterPriority) params.priority = filterPriority;
      if (searchQuery) params.search = searchQuery;

      const { data } = await apiClient.get<{ data: PaginatedResponse<WishlistItem> }>('/wishlist', {
        params,
      });

      set({
        items: [...items, ...data.data.data],
        page: page + 1,
        hasMore: data.data.pagination.hasMore,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  setSortBy: (sortBy) => {
    set({ sortBy });
    get().fetchItems();
  },

  setFilterPriority: (priority) => {
    set({ filterPriority: priority });
    get().fetchItems();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().fetchItems();
  },

  setViewMode: (mode) => set({ viewMode: mode }),

  removeItem: async (itemId) => {
    try {
      await apiClient.delete(`/wishlist/items/${itemId}`);
      set({ items: get().items.filter((i) => i._id !== itemId), total: get().total - 1 });
    } catch {
      // Silent fail, will sync on next fetch
    }
  },

  updateItem: async (itemId, updates) => {
    try {
      await apiClient.patch(`/wishlist/items/${itemId}`, updates);
      set({
        items: get().items.map((i) => (i._id === itemId ? { ...i, ...updates } : i)),
      });
    } catch {
      // Silent fail
    }
  },
}));
