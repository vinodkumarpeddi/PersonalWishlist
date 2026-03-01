import { UserModel, type IUser } from '../models/user.model';
import { WishlistItemModel } from '../models/wishlist-item.model';
import { ApiError } from '../utils/api-error';

export class UserService {
  async getProfile(userId: string): Promise<IUser> {
    const user = await UserModel.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }

  async updateProfile(
    userId: string,
    updates: { name?: string; avatarUrl?: string; currency?: string; locale?: string },
  ): Promise<IUser> {
    const user = await UserModel.findByIdAndUpdate(userId, { $set: updates }, { new: true });
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }

  async getStats(userId: string) {
    const totalItems = await WishlistItemModel.countDocuments({ userId });
    const byPriority = await WishlistItemModel.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    return {
      totalItems,
      byPriority: Object.fromEntries(byPriority.map((b) => [b._id, b.count])),
    };
  }
}

export const userService = new UserService();
