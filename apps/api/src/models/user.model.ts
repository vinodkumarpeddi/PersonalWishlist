import mongoose, { Schema, type Document } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  phone: string;
  countryCode: string;
  name?: string;
  avatarUrl?: string;
  currency: string;
  locale: string;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    phone: { type: String, required: true, unique: true },
    countryCode: { type: String, default: '+91' },
    name: { type: String },
    avatarUrl: { type: String },
    currency: { type: String, default: 'INR' },
    locale: { type: String, default: 'en-IN' },
    onboardingCompleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<IUser>('User', userSchema);
