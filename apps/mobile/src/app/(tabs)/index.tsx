import { useCallback, useEffect } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WText, EmptyState, SkeletonCard } from '../../components/ui';
import { WishlistCard } from '../../components/wishlist/WishlistCard';
import { WishlistHeader } from '../../components/wishlist/WishlistHeader';
import { useWishlistStore } from '../../stores/wishlist-store';

export default function WishlistScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    items,
    isLoading,
    isRefreshing,
    total,
    hasMore,
    viewMode,
    fetchItems,
    loadMore,
    setViewMode,
  } = useWishlistStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleRefresh = useCallback(() => {
    fetchItems(true);
  }, [fetchItems]);

  const handleAddPress = () => {
    // Will be implemented in Chunk 8
    // router.push('/add-product');
  };

  const handleItemPress = (itemId: string) => {
    // Will be implemented in Chunk 9
    // router.push(`/product/${itemId}`);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };

  if (isLoading && items.length === 0) {
    return (
      <View className="flex-1 bg-surface-dark px-4" style={{ paddingTop: insets.top }}>
        <WishlistHeader total={0} viewMode={viewMode} onToggleView={toggleViewMode} onAddPress={handleAddPress} />
        <View className="gap-3">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-surface-dark" style={{ paddingTop: insets.top }}>
        <WishlistHeader total={0} viewMode={viewMode} onToggleView={toggleViewMode} onAddPress={handleAddPress} />
        <EmptyState
          title="Your wishlist is empty"
          description="Start adding products by pasting a shopping link"
          actionLabel="Add First Product"
          onAction={handleAddPress}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface-dark" style={{ paddingTop: insets.top }}>
      <WishlistHeader
        total={total}
        viewMode={viewMode}
        onToggleView={toggleViewMode}
        onAddPress={handleAddPress}
      />
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // Force re-render on mode change
        contentContainerStyle={{ padding: viewMode === 'grid' ? 8 : 16 }}
        renderItem={({ item }) => (
          <WishlistCard
            item={item}
            viewMode={viewMode}
            onPress={() => handleItemPress(item._id)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#6C5CE7"
            colors={['#6C5CE7']}
          />
        }
        onEndReached={() => {
          if (hasMore) loadMore();
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}
