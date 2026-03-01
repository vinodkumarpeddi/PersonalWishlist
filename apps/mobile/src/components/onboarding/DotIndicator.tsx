import { View, useWindowDimensions } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle, interpolate } from 'react-native-reanimated';

interface DotIndicatorProps {
  count: number;
  scrollX: SharedValue<number>;
}

function Dot({ index, scrollX }: { index: number; scrollX: SharedValue<number> }) {
  const { width } = useWindowDimensions();

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      width: interpolate(scrollX.value, inputRange, [8, 24, 8]),
      opacity: interpolate(scrollX.value, inputRange, [0.3, 1, 0.3]),
      backgroundColor: interpolate(scrollX.value, inputRange, [0, 1, 0]) > 0.5
        ? '#6C5CE7'
        : '#6B7280',
    };
  });

  return <Animated.View style={animatedStyle} className="h-2 rounded-full mx-1" />;
}

export function DotIndicator({ count, scrollX }: DotIndicatorProps) {
  return (
    <View className="flex-row items-center justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <Dot key={i} index={i} scrollX={scrollX} />
      ))}
    </View>
  );
}
