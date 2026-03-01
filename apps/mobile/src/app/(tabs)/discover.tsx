import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { WText, WCard, GradientBackground } from '../../components/ui';

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();

  return (
    <GradientBackground variant="accent" style={{ paddingTop: insets.top }}>
      <View className="px-5 pt-4">
        <WText variant="overline" className="text-accent mb-1">EXPLORE</WText>
        <WText variant="h2">Discover</WText>
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <Animated.View entering={FadeInDown.delay(100).springify()} className="items-center">
          <View className="w-24 h-24 rounded-full bg-accent/10 border border-accent/20 items-center justify-center mb-6">
            <WText style={{ fontSize: 44 }}>🔮</WText>
          </View>
          <WText variant="h3" className="text-center mb-3">
            Coming Soon
          </WText>
          <WText variant="bodySmall" className="text-center leading-6">
            Discover trending products, curated deals, and personalized recommendations based on your wishlist.
          </WText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250).springify()} className="w-full mt-10 gap-3">
          <WCard className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-xl bg-brand/15 items-center justify-center">
              <WText style={{ fontSize: 18 }}>🔥</WText>
            </View>
            <View className="flex-1">
              <WText variant="body" className="font-semibold">Trending Deals</WText>
              <WText variant="caption">Popular price drops across stores</WText>
            </View>
          </WCard>
          <WCard className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-xl bg-accent/15 items-center justify-center">
              <WText style={{ fontSize: 18 }}>🎯</WText>
            </View>
            <View className="flex-1">
              <WText variant="body" className="font-semibold">For You</WText>
              <WText variant="caption">Personalized recommendations</WText>
            </View>
          </WCard>
        </Animated.View>
      </View>
    </GradientBackground>
  );
}
