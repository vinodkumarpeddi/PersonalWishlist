import mongoose, { Schema, type Document } from 'mongoose';

export interface IPriceHistory extends Document {
  productId: mongoose.Types.ObjectId;
  pricePaise: number;
  currency: string;
  inStock: boolean;
  recordedAt: Date;
}

const priceHistorySchema = new Schema<IPriceHistory>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  pricePaise: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  inStock: { type: Boolean, default: true },
  recordedAt: { type: Date, default: Date.now },
});

export const PriceHistoryModel = mongoose.model<IPriceHistory>('PriceHistory', priceHistorySchema);
