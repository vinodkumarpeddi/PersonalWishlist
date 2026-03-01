import { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { WText, AnimatedPressable, GradientBackground } from '../../components/ui';
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
      const firebaseToken = 'mock-firebase-token';
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

  const handleResend = () => setError('');

  const maskedPhone = phone ? `${phone.slice(0, 3)} •••• ${phone.slice(-4)}` : '';

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-1 px-7">
          {/* Back */}
          <AnimatedPressable
            onPress={() => router.back()}
            className="self-start mt-4 px-4 py-2 rounded-full bg-white/5 flex-row items-center gap-2"
          >
            <WText variant="bodySmall" className="text-muted-light">←</WText>
            <WText variant="bodySmall" className="text-muted-light font-medium">Back</WText>
          </AnimatedPressable>

          <View className="flex-1 justify-center">
            <Animated.View entering={FadeInDown.delay(100).springify()} className="items-center mb-10">
              <View className="w-16 h-16 rounded-2xl bg-brand/15 border border-brand/25 items-center justify-center mb-5">
                <WText style={{ fontSize: 28 }}>🔐</WText>
              </View>
              <WText variant="h2" className="text-center mb-2">
                Verify Your Number
              </WText>
              <WText variant="bodySmall" className="text-center">
                Enter the 6-digit code sent to
              </WText>
              <WText variant="body" className="text-brand-light font-semibold mt-1">
                {maskedPhone}
              </WText>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).springify()}>
              <OTPInput onComplete={handleVerify} error={error} />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).springify()} className="items-center mt-8">
              <CountdownTimer seconds={30} onResend={handleResend} />
            </Animated.View>

            {loading && (
              <Animated.View entering={FadeInDown.springify()} className="items-center mt-8">
                <View className="px-6 py-3 rounded-2xl bg-brand/10 border border-brand/20">
                  <WText variant="bodySmall" className="text-brand-light font-medium">
                    Verifying...
                  </WText>
                </View>
              </Animated.View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}
