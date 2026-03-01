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
    <View className="flex-row items-center justify-between px-4 py-3">
      <View>
        <WText variant="h2">My Wishlist</WText>
        <WText variant="caption">{total} items</WText>
      </View>
      <View className="flex-row gap-3">
        <AnimatedPressable onPress={onToggleView} className="p-2">
          <WText variant="body">{viewMode === 'list' ? '⊞' : '☰'}</WText>
        </AnimatedPressable>
        <AnimatedPressable
          onPress={onAddPress}
          className="bg-brand rounded-full w-10 h-10 items-center justify-center"
        >
          <WText variant="body" className="text-white text-lg">
            +
          </WText>
        </AnimatedPressable>
      </View>
    </View>
  );
}
