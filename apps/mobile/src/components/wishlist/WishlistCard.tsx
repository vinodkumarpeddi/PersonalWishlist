import { View } from 'react-native';
import { Image } from 'expo-image';
import { WText, WCard, Badge, PriceTag } from '../ui';
import { timeAgo } from '@wishpal/shared';
import type { WishlistItem, Priority } from '@wishpal/shared';

interface WishlistCardProps {
  item: WishlistItem;
  onPress: () => void;
  viewMode: 'list' | 'grid';
}

export function WishlistCard({ item, onPress, viewMode }: WishlistCardProps) {
  const product = item.product;

  if (viewMode === 'grid') {
    return (
      <WCard onPress={onPress} noPadding className="flex-1 m-1.5 overflow-hidden">
        {product?.imageUrl && (
          <Image
            source={{ uri: product.imageUrl }}
            className="w-full h-36"
            contentFit="cover"
            transition={200}
          />
        )}
        <View className="p-3 gap-1.5">
          <WText variant="bodySmall" className="text-white font-medium" numberOfLines={2}>
            {product?.title || 'Loading...'}
          </WText>
          {product && (
            <PriceTag
              currentPricePaise={product.currentPricePaise}
              originalPricePaise={product.originalPricePaise}
              size="sm"
            />
          )}
          <View className="flex-row items-center justify-between mt-1">
            <Badge label={item.priority} priority={item.priority as Priority} />
          </View>
        </View>
      </WCard>
    );
  }

  // List mode
  return (
    <WCard onPress={onPress} className="flex-row gap-3 mb-3">
      {product?.imageUrl && (
        <Image
          source={{ uri: product.imageUrl }}
          className="w-20 h-20 rounded-xl"
          contentFit="cover"
          transition={200}
        />
      )}
      <View className="flex-1 gap-1">
        <WText variant="body" className="font-medium" numberOfLines={2}>
          {product?.title || 'Loading...'}
        </WText>
        {product && (
          <PriceTag
            currentPricePaise={product.currentPricePaise}
            originalPricePaise={product.originalPricePaise}
            size="sm"
          />
        )}
        <View className="flex-row items-center gap-2 mt-auto">
          <Badge label={item.priority} priority={item.priority as Priority} />
          <WText variant="caption">{timeAgo(item.addedAt)}</WText>
        </View>
      </View>
    </WCard>
  );
}
