import { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { WText, WButton, WInput } from '../../components/ui';

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
      // TODO: Firebase phone auth — send OTP
      // For now, navigate to OTP screen
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-surface-dark"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-1 px-6 justify-center">
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <WText variant="h1" className="mb-2">
            Welcome to{'\n'}WishPal
          </WText>
          <WText variant="bodySmall" className="mb-10">
            Enter your phone number to continue
          </WText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <WInput
            label="Phone Number"
            placeholder="Enter 10-digit number"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              setError('');
            }}
            keyboardType="phone-pad"
            maxLength={10}
            error={error}
            leftIcon={
              <WText variant="body" className="text-muted-light font-medium">
                {countryCode}
              </WText>
            }
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} className="mt-8">
          <WButton
            title="Send OTP"
            onPress={handleSendOTP}
            loading={loading}
            disabled={!isValid}
            fullWidth
            size="lg"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).springify()} className="mt-6">
          <WText variant="caption" className="text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </WText>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}
