import { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Linking, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { WText, WButton, WCard, PriceTag, Badge, AnimatedPressable, Skeleton, GradientBackground } from '../../components/ui';
import { PriceHistoryChart } from '../../components/product/PriceHistoryChart';
import { apiClient } from '../../services/api-client';
import { useWishlistStore } from '../../stores/wishlist-store';
import { formatDate, extractDomain } from '@wishpal/shared';
import type { WishlistItem, PriceHistory, Priority } from '@wishpal/shared';

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
      <GradientBackground style={{ paddingTop: insets.top }}>
        <View className="px-5 pt-4">
          <Skeleton height={300} borderRadius={24} />
          <View className="mt-5 gap-3">
            <Skeleton height={28} width="85%" borderRadius={8} />
            <Skeleton height={20} width="50%" borderRadius={8} />
            <Skeleton height={180} borderRadius={20} />
          </View>
        </View>
      </GradientBackground>
    );
  }

  const product = item?.product;
  if (!product) {
    return (
      <GradientBackground style={{ paddingTop: insets.top }}>
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 rounded-full bg-white/5 items-center justify-center mb-4">
            <WText style={{ fontSize: 36 }}>🔍</WText>
          </View>
          <WText variant="h3" className="text-center mb-2">Product Not Found</WText>
          <WText variant="bodySmall" className="text-center text-muted mb-6">
            This product may have been removed or the link is invalid.
          </WText>
          <WButton title="Go Back" onPress={() => router.back()} variant="secondary" />
        </View>
      </GradientBackground>
    );
  }

  const domain = product.url ? extractDomain(product.url) : '';

  return (
    <GradientBackground>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Header */}
        <View className="relative">
          <View className="bg-surface items-center justify-center" style={{ height: 320 }}>
            {product.imageUrl ? (
              <Image
                source={{ uri: product.imageUrl }}
                className="w-full h-full"
                contentFit="contain"
                style={{ backgroundColor: '#12121D' }}
                transition={300}
              />
            ) : (
              <View className="items-center">
                <WText style={{ fontSize: 64 }}>📦</WText>
              </View>
            )}
          </View>

          {/* Floating back button */}
          <View className="absolute top-0 left-0 right-0 flex-row justify-between px-4" style={{ paddingTop: insets.top + 8 }}>
            <AnimatedPressable
              onPress={() => router.back()}
              className="w-10 h-10 rounded-2xl bg-surface-dark/80 border border-white/10 items-center justify-center"
              style={{
                // @ts-expect-error web shadow
                backdropFilter: 'blur(10px)',
              }}
            >
              <WText variant="body">←</WText>
            </AnimatedPressable>
          </View>

          {/* Source badge */}
          {domain && (
            <View className="absolute bottom-3 right-3">
              <Animated.View entering={FadeIn.delay(200)}>
                <View className="px-3 py-1.5 rounded-xl bg-surface-dark/80 border border-white/10">
                  <WText variant="caption" className="text-muted">{domain}</WText>
                </View>
              </Animated.View>
            </View>
          )}
        </View>

        <View className="px-5 pt-5 gap-4">
          {/* Title & Brand */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <WText variant="h2" className="leading-tight">{product.title}</WText>
            {product.brand && (
              <WText variant="bodySmall" className="text-muted mt-1.5">{product.brand}</WText>
            )}
          </Animated.View>

          {/* Price Section */}
          <Animated.View entering={FadeInDown.delay(150).springify()}>
            <WCard className="gap-2">
              <WText variant="overline" className="text-muted mb-1">CURRENT PRICE</WText>
              <PriceTag
                currentPricePaise={product.currentPricePaise}
                originalPricePaise={product.originalPricePaise}
                size="lg"
              />
            </WCard>
          </Animated.View>

          {/* Status Badges */}
          <Animated.View entering={FadeInDown.delay(200).springify()} className="flex-row gap-2 flex-wrap">
            {product.inStock ? (
              <Badge label="In Stock" variant="success" />
            ) : (
              <Badge label="Out of Stock" variant="danger" />
            )}
            {product.rating && <Badge label={`${product.rating} ★`} variant="warning" />}
            {product.reviewCount && (
              <Badge label={`${product.reviewCount.toLocaleString()} reviews`} variant="default" />
            )}
            <Badge label={item!.priority} priority={item!.priority as Priority} />
          </Animated.View>

          {/* Price History Chart */}
          <Animated.View entering={FadeInDown.delay(250).springify()}>
            <WCard>
              <View className="flex-row items-center gap-2 mb-4">
                <View className="w-8 h-8 rounded-xl bg-brand/10 items-center justify-center">
                  <WText style={{ fontSize: 14 }}>📈</WText>
                </View>
                <WText variant="h3">Price History</WText>
              </View>
              <PriceHistoryChart data={priceHistory} />
              {product.lastScrapedAt && (
                <View className="flex-row items-center gap-1.5 mt-3 pt-3 border-t border-white/5">
                  <View className="w-1.5 h-1.5 rounded-full bg-success" />
                  <WText variant="caption" className="text-muted">
                    Last checked {formatDate(product.lastScrapedAt)}
                  </WText>
                </View>
              )}
            </WCard>
          </Animated.View>

          {/* Description */}
          {product.description && (
            <Animated.View entering={FadeInDown.delay(300).springify()}>
              <WCard>
                <View className="flex-row items-center gap-2 mb-3">
                  <View className="w-8 h-8 rounded-xl bg-accent/10 items-center justify-center">
                    <WText style={{ fontSize: 14 }}>📝</WText>
                  </View>
                  <WText variant="h3">Description</WText>
                </View>
                <WText variant="bodySmall" className="leading-6 text-muted" numberOfLines={8}>
                  {product.description}
                </WText>
              </WCard>
            </Animated.View>
          )}

          {/* Actions */}
          <Animated.View entering={FadeInDown.delay(350).springify()} className="gap-3 mt-2">
            <AnimatedPressable
              onPress={handleOpenUrl}
              className="w-full py-4 rounded-2xl bg-brand items-center justify-center"
              style={{
                // @ts-expect-error web shadow
                boxShadow: '0 4px 20px rgba(108, 92, 231, 0.35)',
              }}
            >
              <WText variant="body" className="text-white font-semibold tracking-wide">
                Open in Browser
              </WText>
            </AnimatedPressable>

            <AnimatedPressable
              onPress={handleDelete}
              className="w-full py-4 rounded-2xl bg-danger/10 border border-danger/20 items-center justify-center"
            >
              <WText variant="body" className="text-danger font-semibold tracking-wide">
                Remove from Wishlist
              </WText>
            </AnimatedPressable>
          </Animated.View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}
