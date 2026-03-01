import { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { WText, WButton, WInput, GradientBackground } from '../../components/ui';

export default function PhoneInputScreen() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const countryCode = '+91';
  const isValid = phone.replace(/\D/g, '').length === 10;

  const handleSendOTP = async () => {
    if (!isValid) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      router.push({
        pathname: '/auth/verify',
        params: { phone: `${countryCode}${phone.replace(/\D/g, '')}` },
      });
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-1 px-7 justify-center">
          {/* Logo */}
          <Animated.View entering={FadeInDown.delay(50).springify()} className="items-center mb-10">
            <View className="w-20 h-20 rounded-3xl bg-brand/15 border border-brand/25 items-center justify-center mb-5">
              <WText style={{ fontSize: 36 }}>💜</WText>
            </View>
            <WText variant="h1" className="text-center">
              Welcome to{'\n'}WishPal
            </WText>
            <WText variant="bodySmall" className="text-center mt-3 leading-5">
              Your AI-powered shopping assistant.{'\n'}Track prices. Save money. Shop smart.
            </WText>
          </Animated.View>

          {/* Phone input */}
          <Animated.View entering={FadeInDown.delay(150).springify()}>
            <WInput
              label="Phone Number"
              placeholder="Enter 10-digit number"
              value={phone}
              onChangeText={(text) => {
                setPhone(text.replace(/\D/g, ''));
                setError('');
              }}
              keyboardType="phone-pad"
              maxLength={10}
              error={error}
              leftIcon={
                <View className="flex-row items-center gap-2 pr-3 border-r border-white/10">
                  <WText variant="body" className="text-lg">🇮🇳</WText>
                  <WText variant="body" className="text-muted-light font-semibold">
                    {countryCode}
                  </WText>
                </View>
              }
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(250).springify()} className="mt-8">
            <WButton
              title="Send OTP"
              onPress={handleSendOTP}
              loading={loading}
              disabled={!isValid}
              fullWidth
              size="lg"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(350).springify()} className="mt-8">
            <WText variant="caption" className="text-center leading-5">
              By continuing, you agree to our{' '}
              <WText variant="caption" className="text-brand-light">Terms of Service</WText>
              {' '}and{' '}
              <WText variant="caption" className="text-brand-light">Privacy Policy</WText>
            </WText>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}
