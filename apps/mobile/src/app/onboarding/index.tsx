import { useRef } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingSlide, type SlideData } from '../../components/onboarding/OnboardingSlide';
import { DotIndicator } from '../../components/onboarding/DotIndicator';
import { WButton, WText } from '../../components/ui';
import { AnimatedPressable } from '../../components/ui';
import { useOnboardingStore } from '../../stores/onboarding-store';

const slides: SlideData[] = [
  {
    emoji: '🛍️',
    title: 'Save Products\nFrom Anywhere',
    description:
      'Paste any shopping link and we\'ll automatically extract product details, images, and prices.',
    gradient: 'bg-brand/20',
  },
  {
    emoji: '📉',
    title: 'Track Prices\nAutomatically',
    description:
      'We check prices every 6 hours and show you the complete price history so you never miss a deal.',
    gradient: 'bg-accent/20',
  },
  {
    emoji: '🔔',
    title: 'Get Alerts\nInstantly',
    description:
      'Set your target price and get notified the moment the price drops. Never overpay again.',
    gradient: 'bg-success/20',
  },
];

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<Animated.FlatList<SlideData>>(null);
  const currentIndex = useSharedValue(0);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      currentIndex.value = Math.round(event.contentOffset.x / width);
    },
  });

  const handleNext = () => {
    const nextIndex = Math.round(scrollX.value / width) + 1;
    if (nextIndex < slides.length) {
      scrollRef.current?.scrollToOffset({ offset: nextIndex * width, animated: true });
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = async () => {
    await completeOnboarding();
    router.replace('/auth');
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const isLast = scrollX.value >= (slides.length - 1.5) * width;
    return {
      transform: [{ scale: withSpring(isLast ? 1 : 0.95) }],
    };
  });

  return (
    <View className="flex-1 bg-surface-dark" style={{ paddingTop: insets.top }}>
      {/* Skip button */}
      <View className="flex-row justify-end px-6 py-4">
        <AnimatedPressable onPress={handleGetStarted}>
          <WText variant="bodySmall" className="text-muted-light">
            Skip
          </WText>
        </AnimatedPressable>
      </View>

      {/* Slides */}
      <Animated.FlatList
        ref={scrollRef}
        data={slides}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <OnboardingSlide slide={item} index={index} scrollX={scrollX} />
        )}
      />

      {/* Bottom section */}
      <View
        className="px-8 gap-6 pb-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <DotIndicator count={slides.length} scrollX={scrollX} />

        <Animated.View style={buttonAnimatedStyle}>
          <WButton
            title="Continue"
            onPress={handleNext}
            fullWidth
            size="lg"
          />
        </Animated.View>
      </View>
    </View>
  );
}
