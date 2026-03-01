export interface ExtractedProduct {
  title: string;
  description?: string;
  imageUrl?: string;
  images: string[];
  pricePaise: number;
  originalPricePaise?: number;
  currency: string;
  inStock: boolean;
  brand?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  metadata: Record<string, unknown>;
}

export interface SiteConfig {
  domain: string;
  selectors: {
    title: string;
    price: string;
    originalPrice?: string;
    image?: string;
    description?: string;
    brand?: string;
    rating?: string;
    reviewCount?: string;
    inStock?: string;
  };
  priceTransform?: (raw: string) => number;
}
