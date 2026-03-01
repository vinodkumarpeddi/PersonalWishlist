import { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { WText, WButton, WInput, WCard, PriceTag, AnimatedPressable, Badge } from '../components/ui';
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-surface-dark"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <AnimatedPressable onPress={() => router.back()}>
            <WText variant="body" className="text-brand">
              ← Back
            </WText>
          </AnimatedPressable>
          <WText variant="h3">Add Product</WText>
          <View className="w-12" />
        </View>

        {/* Clipboard suggestion */}
        {clipboardUrl && (
          <Animated.View entering={FadeInDown.springify()}>
            <WCard onPress={handlePasteClipboard} className="mb-4 border-brand/30">
              <WText variant="caption" className="text-brand mb-1">
                Found URL in clipboard
              </WText>
              <WText variant="bodySmall" numberOfLines={1}>
                {clipboardUrl}
              </WText>
              <WText variant="caption" className="text-brand mt-1">
                Tap to paste and extract
              </WText>
            </WCard>
          </Animated.View>
        )}

        {/* URL Input */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <WInput
            label="Product URL"
            placeholder="Paste Amazon, Flipkart, or any shopping link"
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()} className="mt-4">
          <WButton
            title="Extract Product"
            onPress={handleExtract}
            loading={extractionStatus === 'processing'}
            disabled={!url.trim() || extractionStatus === 'processing'}
            fullWidth
          />
        </Animated.View>

        {/* Extraction Progress */}
        {extractionStatus === 'processing' && (
          <Animated.View entering={FadeIn} className="mt-6 items-center">
            <WText variant="bodySmall" className="text-brand">
              Extracting product details...
            </WText>
            <WText variant="caption" className="mt-1">
              This may take a few seconds
            </WText>
          </Animated.View>
        )}

        {/* Error */}
        {extractionStatus === 'failed' && (
          <Animated.View entering={FadeIn} className="mt-6">
            <WCard className="border-danger/30">
              <WText variant="body" className="text-danger">
                Extraction Failed
              </WText>
              <WText variant="caption" className="mt-1">
                {extractionError || 'Could not extract product data. Try a different URL.'}
              </WText>
            </WCard>
          </Animated.View>
        )}

        {/* Product Preview */}
        {extractedProduct && extractionStatus === 'completed' && (
          <Animated.View entering={FadeInDown.springify()} className="mt-6">
            <WText variant="label" className="mb-3">
              Product Preview
            </WText>
            <WCard>
              {extractedProduct.imageUrl && (
                <Image
                  source={{ uri: extractedProduct.imageUrl }}
                  className="w-full h-48 rounded-xl mb-3"
                  contentFit="contain"
                  transition={200}
                />
              )}
              <WText variant="h3" numberOfLines={3}>
                {extractedProduct.title}
              </WText>
              {extractedProduct.brand && (
                <WText variant="caption" className="mt-1">
                  {extractedProduct.brand}
                </WText>
              )}
              <View className="mt-3">
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

              <View className="mt-4">
                <WButton
                  title="Add to Wishlist"
                  onPress={handleAddToWishlist}
                  fullWidth
                  size="lg"
                />
              </View>
            </WCard>
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
