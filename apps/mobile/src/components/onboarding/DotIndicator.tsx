import { View, useWindowDimensions } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle, interpolate, withSpring } from 'react-native-reanimated';

interface DotIndicatorProps {
  count: number;
  scrollX: SharedValue<number>;
}

function Dot({ index, scrollX }: { index: number; scrollX: SharedValue<number> }) {
  const { width } = useWindowDimensions();

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const dotWidth = interpolate(scrollX.value, inputRange, [6, 28, 6]);
    const opacity = interpolate(scrollX.value, inputRange, [0.25, 1, 0.25]);

    return {
      width: withSpring(dotWidth, { damping: 20, stiffness: 300 }),
      opacity,
    };
  });

  return (
    <Animated.View
      style={animatedStyle}
      className="h-1.5 rounded-full mx-1 bg-brand"
    />
  );
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
