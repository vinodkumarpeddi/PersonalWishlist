import { View, useWindowDimensions } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { WText } from '../ui';

export interface SlideData {
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
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
        { scale: interpolate(scrollX.value, inputRange, [0.4, 1, 0.4]) },
        { translateY: interpolate(scrollX.value, inputRange, [60, 0, 60]) },
      ],
      opacity: interpolate(scrollX.value, inputRange, [0, 1, 0]),
    };
  });

  const animatedText = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      transform: [{ translateY: interpolate(scrollX.value, inputRange, [30, 0, -30]) }],
      opacity: interpolate(scrollX.value, inputRange, [0, 1, 0]),
    };
  });

  return (
    <View style={{ width }} className="flex-1 items-center justify-center px-10">
      {/* Background glow */}
      <View
        className="absolute w-80 h-80 rounded-full opacity-15"
        style={{
          backgroundColor: slide.accentColor,
          // @ts-expect-error web filter
          filter: 'blur(60px)',
          top: '20%',
        }}
      />

      {/* Icon circle */}
      <Animated.View style={animatedIcon} className="mb-14">
        <View
          className="w-44 h-44 rounded-full items-center justify-center"
          style={{
            backgroundColor: `${slide.accentColor}15`,
            borderWidth: 1,
            borderColor: `${slide.accentColor}30`,
          }}
        >
          <View
            className="w-28 h-28 rounded-full items-center justify-center"
            style={{ backgroundColor: `${slide.accentColor}20` }}
          >
            <Animated.Text style={{ fontSize: 52 }}>{slide.emoji}</Animated.Text>
          </View>
        </View>
      </Animated.View>

      {/* Text content */}
      <Animated.View style={animatedText} className="items-center">
        <WText variant="overline" className="mb-3" style={{ color: slide.accentColor }}>
          {slide.subtitle}
        </WText>
        <WText variant="h1" className="text-center mb-4 leading-10">
          {slide.title}
        </WText>
        <WText variant="bodySmall" className="text-center leading-6 px-2">
          {slide.description}
        </WText>
      </Animated.View>
    </View>
  );
}
