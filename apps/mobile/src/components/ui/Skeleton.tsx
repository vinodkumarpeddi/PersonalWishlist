import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({ width, height = 20, borderRadius = 8, className = '' }: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: width as number | undefined,
          height,
          borderRadius,
        },
      ]}
      className={`bg-surface-light ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <View className="rounded-2xl bg-surface-light p-4 gap-3">
      <Skeleton height={160} borderRadius={12} />
      <Skeleton width="70%" height={16} />
      <Skeleton width="40%" height={14} />
      <View className="flex-row justify-between mt-1">
        <Skeleton width={80} height={20} />
        <Skeleton width={60} height={20} />
      </View>
    </View>
  );
}
