import { View, useWindowDimensions } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { WText } from '../ui';

export interface SlideData {
  emoji: string;
  title: string;
  description: string;
  gradient: string;
}

interface OnboardingSlideProps {
  slide: SlideData;
  index: number;
  scrollX: SharedValue<number>;
}

export function OnboardingSlide({ slide, index, scrollX }: OnboardingSlideProps) {
  const { width } = useWindowDimensions();

  const animatedIcon = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      transform: [
        { scale: interpolate(scrollX.value, inputRange, [0.5, 1, 0.5]) },
        { translateY: interpolate(scrollX.value, inputRange, [40, 0, 40]) },
      ],
      opacity: interpolate(scrollX.value, inputRange, [0, 1, 0]),
    };
  });

  const animatedText = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      transform: [{ translateX: interpolate(scrollX.value, inputRange, [50, 0, -50]) }],
      opacity: interpolate(scrollX.value, inputRange, [0, 1, 0]),
    };
  });

  return (
    <View style={{ width }} className="flex-1 items-center justify-center px-8">
      <Animated.View style={animatedIcon} className="mb-12">
        <View
          className={`w-40 h-40 rounded-full items-center justify-center ${slide.gradient}`}
        >
          <Animated.Text style={{ fontSize: 64 }}>{slide.emoji}</Animated.Text>
        </View>
      </Animated.View>

      <Animated.View style={animatedText} className="items-center">
        <WText variant="h1" className="text-center mb-4">
          {slide.title}
        </WText>
        <WText variant="body" className="text-center text-muted-light leading-6">
          {slide.description}
        </WText>
      </Animated.View>
    </View>
  );
}
