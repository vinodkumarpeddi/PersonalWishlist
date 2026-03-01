import { useCallback, useEffect } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { EmptyState, SkeletonCard, GradientBackground } from '../../components/ui';
import { WishlistCard } from '../../components/wishlist/WishlistCard';
import { WishlistHeader } from '../../components/wishlist/WishlistHeader';
import { useWishlistStore } from '../../stores/wishlist-store';

export default function WishlistScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    items, isLoading, isRefreshing, total, hasMore, viewMode,
    fetchItems, loadMore, setViewMode,
  } = useWishlistStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleRefresh = useCallback(() => fetchItems(true), [fetchItems]);
  const handleAddPress = () => {};
  const handleItemPress = (_itemId: string) => {};
  const toggleViewMode = () => setViewMode(viewMode === 'list' ? 'grid' : 'list');

  if (isLoading && items.length === 0) {
    return (
      <GradientBackground style={{ paddingTop: insets.top }}>
        <WishlistHeader total={0} viewMode={viewMode} onToggleView={toggleViewMode} onAddPress={handleAddPress} />
        <View className="px-5 gap-3">
          {[1, 2, 3].map((i) => (
            <Animated.View key={i} entering={FadeInDown.delay(i * 100).springify()}>
              <SkeletonCard />
            </Animated.View>
          ))}
        </View>
      </GradientBackground>
    );
  }

  if (items.length === 0) {
    return (
      <GradientBackground style={{ paddingTop: insets.top }}>
        <WishlistHeader total={0} viewMode={viewMode} onToggleView={toggleViewMode} onAddPress={handleAddPress} />
        <EmptyState
          emoji="🛍️"
          title="Start Your Wishlist"
          description="Add products from any shopping site. We'll track prices and alert you on drops."
          actionLabel="Add Your First Product"
          onAction={handleAddPress}
        />
      </GradientBackground>
    );
  }

  return (
    <GradientBackground style={{ paddingTop: insets.top }}>
      <WishlistHeader total={total} viewMode={viewMode} onToggleView={toggleViewMode} onAddPress={handleAddPress} />
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode}
        contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: viewMode === 'grid' ? 12 : 0 }}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
            <WishlistCard item={item} viewMode={viewMode} onPress={() => handleItemPress(item._id)} />
          </Animated.View>
        )}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#6C5CE7" colors={['#6C5CE7']} />
        }
        onEndReached={() => { if (hasMore) loadMore(); }}
        onEndReachedThreshold={0.5}
      />
    </GradientBackground>
  );
}
