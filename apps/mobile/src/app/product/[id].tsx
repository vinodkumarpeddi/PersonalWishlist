import { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Linking, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { WText, WButton, WCard, PriceTag, Badge, AnimatedPressable, Skeleton } from '../../components/ui';
import { PriceHistoryChart } from '../../components/product/PriceHistoryChart';
import { apiClient } from '../../services/api-client';
import { useWishlistStore } from '../../stores/wishlist-store';
import { formatDate } from '@wishpal/shared';
import type { WishlistItem, PriceHistory } from '@wishpal/shared';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [item, setItem] = useState<WishlistItem | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const removeItem = useWishlistStore((s) => s.removeItem);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const { data: itemRes } = await apiClient.get(`/wishlist/items/${id}`);
      setItem(itemRes.data);

      if (itemRes.data.productId) {
        const productId = typeof itemRes.data.productId === 'object'
          ? itemRes.data.productId._id
          : itemRes.data.productId;
        const { data: historyRes } = await apiClient.get(`/products/${productId}/price-history`);
        setPriceHistory(historyRes.data || []);
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUrl = useCallback(() => {
    if (item?.product?.url) {
      Linking.openURL(item.product.url);
    }
  }, [item]);

  const handleDelete = () => {
    Alert.alert('Remove from Wishlist', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          if (id) {
            await removeItem(id);
            router.back();
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-surface-dark p-4" style={{ paddingTop: insets.top }}>
        <Skeleton height={300} borderRadius={16} />
        <View className="mt-4 gap-3">
          <Skeleton height={24} width="80%" />
          <Skeleton height={20} width="50%" />
          <Skeleton height={200} borderRadius={16} />
        </View>
      </View>
    );
  }

  const product = item?.product;
  if (!product) {
    return (
      <View className="flex-1 bg-surface-dark items-center justify-center">
        <WText variant="body">Product not found</WText>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-surface-dark"
      contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
    >
      {/* Header */}
      <View className="relative">
        {product.imageUrl && (
          <Image
            source={{ uri: product.imageUrl }}
            className="w-full h-80"
            contentFit="contain"
            style={{ backgroundColor: '#1A1A25' }}
            transition={300}
          />
        )}
        <View className="absolute top-0 left-0 right-0 flex-row justify-between p-4" style={{ paddingTop: insets.top }}>
          <AnimatedPressable
            onPress={() => router.back()}
            className="bg-surface/80 rounded-full w-10 h-10 items-center justify-center"
          >
            <WText variant="body">←</WText>
          </AnimatedPressable>
        </View>
      </View>

      <View className="px-4 pt-4 gap-4">
        {/* Title & Brand */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <WText variant="h2">{product.title}</WText>
          {product.brand && (
            <WText variant="bodySmall" className="mt-1">
              {product.brand}
            </WText>
          )}
        </Animated.View>

        {/* Price */}
        <Animated.View entering={FadeInDown.delay(150)}>
          <PriceTag
            currentPricePaise={product.currentPricePaise}
            originalPricePaise={product.originalPricePaise}
            size="lg"
          />
        </Animated.View>

        {/* Status badges */}
        <Animated.View entering={FadeInDown.delay(200)} className="flex-row gap-2 flex-wrap">
          {product.inStock ? (
            <Badge label="In Stock" variant="success" />
          ) : (
            <Badge label="Out of Stock" variant="danger" />
          )}
          {product.rating && <Badge label={`${product.rating} ★`} variant="warning" />}
          {product.reviewCount && (
            <Badge label={`${product.reviewCount.toLocaleString()} reviews`} variant="default" />
          )}
          <Badge label={item!.priority} priority={item!.priority as any} />
        </Animated.View>

        {/* Price History Chart */}
        <Animated.View entering={FadeInDown.delay(250)}>
          <WCard>
            <WText variant="h3" className="mb-3">
              Price History
            </WText>
            <PriceHistoryChart data={priceHistory} />
            {product.lastScrapedAt && (
              <WText variant="caption" className="mt-2">
                Last checked: {formatDate(product.lastScrapedAt)}
              </WText>
            )}
          </WCard>
        </Animated.View>

        {/* Description */}
        {product.description && (
          <Animated.View entering={FadeInDown.delay(300)}>
            <WCard>
              <WText variant="label" className="mb-2">
                Description
              </WText>
              <WText variant="bodySmall" numberOfLines={6}>
                {product.description}
              </WText>
            </WCard>
          </Animated.View>
        )}

        {/* Actions */}
        <Animated.View entering={FadeInDown.delay(350)} className="gap-3">
          <WButton title="Open in Browser" onPress={handleOpenUrl} variant="secondary" fullWidth />
          <WButton title="Remove from Wishlist" onPress={handleDelete} variant="danger" fullWidth />
        </Animated.View>
      </View>
    </ScrollView>
  );
}
