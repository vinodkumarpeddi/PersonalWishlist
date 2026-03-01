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
        <View className="bg-surface items-center justify-center" style={{ height: 140 }}>
          {product?.imageUrl ? (
            <Image
              source={{ uri: product.imageUrl }}
              className="w-full h-full"
              contentFit="cover"
              transition={300}
            />
          ) : (
            <WText style={{ fontSize: 32 }}>📦</WText>
          )}
        </View>
        <View className="p-3.5 gap-2">
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
          <Badge label={item.priority} priority={item.priority as Priority} />
        </View>
      </WCard>
    );
  }

  return (
    <WCard onPress={onPress} className="flex-row gap-4 mb-3 mx-5">
      <View className="w-20 h-20 rounded-2xl bg-surface overflow-hidden items-center justify-center">
        {product?.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            className="w-full h-full"
            contentFit="cover"
            transition={300}
          />
        ) : (
          <WText style={{ fontSize: 28 }}>📦</WText>
        )}
      </View>
      <View className="flex-1 gap-1.5 justify-center">
        <WText variant="body" className="font-semibold" numberOfLines={2}>
          {product?.title || 'Loading...'}
        </WText>
        {product && (
          <PriceTag
            currentPricePaise={product.currentPricePaise}
            originalPricePaise={product.originalPricePaise}
            size="sm"
          />
        )}
        <View className="flex-row items-center gap-2 mt-0.5">
          <Badge label={item.priority} priority={item.priority as Priority} />
          <WText variant="caption">{timeAgo(item.addedAt)}</WText>
        </View>
      </View>
    </WCard>
  );
}
