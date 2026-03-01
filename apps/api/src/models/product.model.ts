import mongoose, { Schema, type Document } from 'mongoose';

export interface IProduct extends Document {
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
  lastScrapedAt: Date;
  scrapeStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    url: { type: String, required: true },
    normalizedUrl: { type: String, required: true, unique: true, index: true },
    domain: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    images: [{ type: String }],
    currentPricePaise: { type: Number, required: true },
    originalPricePaise: { type: Number },
    currency: { type: String, default: 'INR' },
    inStock: { type: Boolean, default: true },
    brand: { type: String },
    category: { type: String },
    rating: { type: Number },
    reviewCount: { type: Number },
    metadata: { type: Schema.Types.Mixed, default: {} },
    lastScrapedAt: { type: Date, default: Date.now },
    scrapeStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

export const ProductModel = mongoose.model<IProduct>('Product', productSchema);
