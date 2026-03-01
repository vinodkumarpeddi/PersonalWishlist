import { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { WText, WButton, WInput, WCard, PriceTag, AnimatedPressable, Badge, GradientBackground } from '../components/ui';
import { useProductStore } from '../stores/product-store';
import { useWishlistStore } from '../stores/wishlist-store';

export default function AddProductScreen() {
  const [url, setUrl] = useState('');
  const [clipboardUrl, setClipboardUrl] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { extractedProduct, extractionStatus, extractionError, extractProduct, clearExtraction } =
    useProductStore();
  const fetchItems = useWishlistStore((s) => s.fetchItems);

  // Check clipboard on mount
  useEffect(() => {
    (async () => {
      try {
        const content = await Clipboard.getStringAsync();
        if (content && (content.startsWith('http://') || content.startsWith('https://'))) {
          setClipboardUrl(content);
        }
      } catch {
        // Clipboard access denied
      }
    })();

    return () => clearExtraction();
  }, [clearExtraction]);

  const handleExtract = () => {
    if (!url.trim()) return;
    extractProduct(url.trim());
  };

  const handlePasteClipboard = () => {
    if (clipboardUrl) {
      setUrl(clipboardUrl);
      setClipboardUrl(null);
      extractProduct(clipboardUrl);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await useProductStore.getState().addToWishlist({});
      fetchItems(true);
      router.back();
    } catch {
      // Error handled in store
    }
  };

  return (
    <GradientBackground variant="brand" style={{ paddingTop: insets.top }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(50).springify()} className="flex-row items-center justify-between pt-4 pb-6">
            <AnimatedPressable
              onPress={() => router.back()}
              className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 items-center justify-center"
            >
              <WText variant="body">←</WText>
            </AnimatedPressable>
            <View className="items-center">
              <WText variant="overline" className="text-brand-light mb-0.5">NEW ITEM</WText>
              <WText variant="h3">Add Product</WText>
            </View>
            <View className="w-10" />
          </Animated.View>

          {/* Clipboard suggestion */}
          {clipboardUrl && (
            <Animated.View entering={FadeInDown.springify()}>
              <WCard onPress={handlePasteClipboard} className="mb-5 border-brand/30" glow>
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-brand/15 items-center justify-center">
                    <WText style={{ fontSize: 18 }}>📋</WText>
                  </View>
                  <View className="flex-1">
                    <WText variant="body" className="font-semibold text-brand mb-0.5">
                      URL Found in Clipboard
                    </WText>
                    <WText variant="caption" numberOfLines={1}>
                      {clipboardUrl}
                    </WText>
                  </View>
                  <View className="px-3 py-1.5 rounded-xl bg-brand/15">
                    <WText variant="caption" className="text-brand font-semibold">Paste</WText>
                  </View>
                </View>
              </WCard>
            </Animated.View>
          )}

          {/* URL Input Section */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <WCard className="gap-4">
              <View className="flex-row items-center gap-2 mb-1">
                <View className="w-8 h-8 rounded-xl bg-brand/10 items-center justify-center">
                  <WText style={{ fontSize: 14 }}>🔗</WText>
                </View>
                <WText variant="body" className="font-semibold">Product Link</WText>
              </View>
              <WInput
                placeholder="https://amazon.in/product..."
                value={url}
                onChangeText={setUrl}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
              <WButton
                title="Extract Product"
                onPress={handleExtract}
                loading={extractionStatus === 'processing'}
                disabled={!url.trim() || extractionStatus === 'processing'}
                fullWidth
              />
            </WCard>
          </Animated.View>

          {/* Supported Stores */}
          <Animated.View entering={FadeInDown.delay(200).springify()} className="mt-4">
            <WCard>
              <WText variant="caption" className="text-muted mb-3">SUPPORTED STORES</WText>
              <View className="flex-row flex-wrap gap-2">
                {['Amazon', 'Flipkart', 'Myntra', 'Any URL'].map((store) => (
                  <View key={store} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                    <WText variant="caption" className="font-medium">{store}</WText>
                  </View>
                ))}
              </View>
            </WCard>
          </Animated.View>

          {/* Extraction Progress */}
          {extractionStatus === 'processing' && (
            <Animated.View entering={FadeIn} className="mt-6">
              <WCard className="items-center py-8">
                <View className="w-16 h-16 rounded-full bg-brand/10 items-center justify-center mb-4">
                  <WText style={{ fontSize: 28 }}>🔮</WText>
                </View>
                <WText variant="body" className="text-brand font-semibold mb-1">
                  Extracting Product...
                </WText>
                <WText variant="caption" className="text-muted">
                  Analyzing page and pulling details
                </WText>
              </WCard>
            </Animated.View>
          )}

          {/* Error */}
          {extractionStatus === 'failed' && (
            <Animated.View entering={FadeIn} className="mt-6">
              <WCard className="border-danger/20">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-danger/10 items-center justify-center">
                    <WText style={{ fontSize: 18 }}>⚠️</WText>
                  </View>
                  <View className="flex-1">
                    <WText variant="body" className="text-danger font-semibold">
                      Extraction Failed
                    </WText>
                    <WText variant="caption" className="mt-0.5">
                      {extractionError || 'Could not extract product data. Try a different URL.'}
                    </WText>
                  </View>
                </View>
              </WCard>
            </Animated.View>
          )}

          {/* Product Preview */}
          {extractedProduct && extractionStatus === 'completed' && (
            <Animated.View entering={FadeInDown.springify()} className="mt-6">
              <WText variant="overline" className="text-success mb-3 px-1">PRODUCT FOUND</WText>
              <WCard>
                {extractedProduct.imageUrl && (
                  <View className="rounded-2xl overflow-hidden bg-surface mb-4">
                    <Image
                      source={{ uri: extractedProduct.imageUrl }}
                      className="w-full"
                      style={{ height: 200 }}
                      contentFit="contain"
                      transition={200}
                    />
                  </View>
                )}
                <WText variant="h3" numberOfLines={3} className="leading-tight">
                  {extractedProduct.title}
                </WText>
                {extractedProduct.brand && (
                  <WText variant="caption" className="text-muted mt-1.5">
                    {extractedProduct.brand}
                  </WText>
                )}
                <View className="mt-3 p-3 rounded-2xl bg-white/5">
                  <PriceTag
                    currentPricePaise={extractedProduct.currentPricePaise}
                    originalPricePaise={extractedProduct.originalPricePaise}
                    size="lg"
                  />
                </View>
                <View className="flex-row gap-2 mt-3">
                  {extractedProduct.inStock ? (
                    <Badge label="In Stock" variant="success" />
                  ) : (
                    <Badge label="Out of Stock" variant="danger" />
                  )}
                  {extractedProduct.rating && (
                    <Badge label={`${extractedProduct.rating} ★`} variant="warning" />
                  )}
                </View>

                <View className="mt-5">
                  <AnimatedPressable
                    onPress={handleAddToWishlist}
                    className="w-full py-4 rounded-2xl bg-brand items-center justify-center"
                    style={{
                      // @ts-expect-error web shadow
                      boxShadow: '0 4px 20px rgba(108, 92, 231, 0.4)',
                    }}
                  >
                    <WText variant="body" className="text-white font-bold tracking-wide">
                      Add to Wishlist
                    </WText>
                  </AnimatedPressable>
                </View>
              </WCard>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}
