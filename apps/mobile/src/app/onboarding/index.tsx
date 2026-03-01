import { useRef } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingSlide, type SlideData } from '../../components/onboarding/OnboardingSlide';
import { DotIndicator } from '../../components/onboarding/DotIndicator';
import { WButton, WText, AnimatedPressable, GradientBackground } from '../../components/ui';
import { useOnboardingStore } from '../../stores/onboarding-store';

const slides: SlideData[] = [
  {
    emoji: '🛍️',
    subtitle: 'SAVE ANYTHING',
    title: 'Your Wishlist,\nAnywhere',
    description:
      'Paste any shopping link — Amazon, Flipkart, Myntra or any store. We auto-extract every detail for you.',
    accentColor: '#6C5CE7',
  },
  {
    emoji: '📊',
    subtitle: 'SMART TRACKING',
    title: 'Never Miss\na Price Drop',
    description:
      'We monitor prices every 6 hours and build a complete history. Buy at the perfect moment.',
    accentColor: '#00D2D3',
  },
  {
    emoji: '⚡',
    subtitle: 'INSTANT ALERTS',
    title: 'Set It,\nForget It',
    description:
      'Set your target price and relax. We\'ll notify you the instant it drops. Zero effort, max savings.',
    accentColor: '#00B894',
  },
];

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<Animated.FlatList<SlideData>>(null);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
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

  const buttonTextStyle = useAnimatedStyle(() => {
    const isLast = scrollX.value >= (slides.length - 1.3) * width;
    return {
      opacity: interpolate(
        scrollX.value,
        [(slides.length - 1.5) * width, (slides.length - 1) * width],
        [0, 1],
      ),
    };
  });

  return (
    <GradientBackground variant="brand" style={{ paddingTop: insets.top }}>
      {/* Skip */}
      <View className="flex-row justify-end px-6 pt-4 pb-2">
        <AnimatedPressable onPress={handleGetStarted} className="px-4 py-2 rounded-full bg-white/5">
          <WText variant="caption" className="text-muted-light font-medium">
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

      {/* Bottom */}
      <View className="px-8 gap-7 pb-4" style={{ paddingBottom: insets.bottom + 20 }}>
        <DotIndicator count={slides.length} scrollX={scrollX} />
        <WButton title="Continue" onPress={handleNext} fullWidth size="lg" />
      </View>
    </GradientBackground>
  );
}
