import { View } from 'react-native';
import { WText, AnimatedPressable } from '../ui';
import type { ViewMode } from '@wishpal/shared';

interface WishlistHeaderProps {
  total: number;
  viewMode: ViewMode;
  onToggleView: () => void;
  onAddPress: () => void;
}

export function WishlistHeader({ total, viewMode, onToggleView, onAddPress }: WishlistHeaderProps) {
  return (
    <View className="px-5 pt-4 pb-3">
      {/* Top row */}
      <View className="flex-row items-center justify-between mb-1">
        <View>
          <WText variant="overline" className="text-brand-light mb-1">MY COLLECTION</WText>
          <WText variant="h2">Wishlist</WText>
        </View>
        <View className="flex-row gap-2">
          <AnimatedPressable
            onPress={onToggleView}
            className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 items-center justify-center"
          >
            <WText style={{ fontSize: 16 }}>{viewMode === 'list' ? '⊞' : '☰'}</WText>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={onAddPress}
            className="w-10 h-10 rounded-2xl bg-brand items-center justify-center"
            style={{
              // @ts-expect-error web shadow
              boxShadow: '0 4px 16px rgba(108, 92, 231, 0.4)',
            }}
          >
            <WText variant="body" className="text-white text-xl font-light">+</WText>
          </AnimatedPressable>
        </View>
      </View>

      {/* Stats */}
      <View className="flex-row items-center gap-1.5 mt-1">
        <View className="w-1.5 h-1.5 rounded-full bg-brand" />
        <WText variant="caption" className="font-medium">
          {total} {total === 1 ? 'item' : 'items'} saved
        </WText>
      </View>
    </View>
  );
}
