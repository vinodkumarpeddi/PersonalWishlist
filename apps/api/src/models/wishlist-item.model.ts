import mongoose, { Schema, type Document } from 'mongoose';

export interface IWishlistItem extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  targetPricePaise?: number;
  priority: string;
  notes?: string;
  notifyOnPriceDrop: boolean;
  addedAt: Date;
  updatedAt: Date;
}

const wishlistItemSchema = new Schema<IWishlistItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    targetPricePaise: { type: Number },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    notes: { type: String, maxlength: 500 },
    notifyOnPriceDrop: { type: Boolean, default: true },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// One product per user
wishlistItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const WishlistItemModel = mongoose.model<IWishlistItem>('WishlistItem', wishlistItemSchema);
