import { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { WText } from '../../components/ui';
import { AnimatedPressable } from '../../components/ui';
import { OTPInput } from '../../components/auth/OTPInput';
import { CountdownTimer } from '../../components/auth/CountdownTimer';
import { useAuthStore } from '../../stores/auth-store';
import { apiClient } from '../../services/api-client';
import type { AuthResponse } from '@wishpal/shared';

export default function VerifyOTPScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleVerify = async (code: string) => {
    setLoading(true);
    setError('');

    try {
      // TODO: Firebase verify OTP → get Firebase ID token
      // Then send to our backend
      const firebaseToken = 'mock-firebase-token'; // Replace with real Firebase token

      const { data } = await apiClient.post<{ data: AuthResponse }>('/auth/verify-token', {
        firebaseToken,
      });

      await setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      router.replace('/(tabs)');
    } catch {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    // TODO: Resend OTP via Firebase
    setError('');
  };

  const maskedPhone = phone
    ? `${phone.slice(0, 3)} ****${phone.slice(-4)}`
    : '';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-surface-dark"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-1 px-6">
        {/* Back button */}
        <AnimatedPressable onPress={() => router.back()} className="py-4">
          <WText variant="body" className="text-brand">
            ← Back
          </WText>
        </AnimatedPressable>

        <View className="flex-1 justify-center">
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <WText variant="h1" className="mb-2">
              Verify OTP
            </WText>
            <WText variant="bodySmall" className="mb-10">
              Enter the 6-digit code sent to {maskedPhone}
            </WText>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <OTPInput onComplete={handleVerify} error={error} />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(300).springify()}
            className="items-center mt-8"
          >
            <CountdownTimer seconds={30} onResend={handleResend} />
          </Animated.View>

          {loading && (
            <Animated.View entering={FadeInDown.springify()} className="items-center mt-6">
              <WText variant="bodySmall" className="text-brand">
                Verifying...
              </WText>
            </Animated.View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
