import '../global.css';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../stores/auth-store';
import { useOnboardingStore } from '../stores/onboarding-store';

function AuthGate({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, loadTokens } = useAuthStore();
  const { hasCompletedOnboarding, isLoading: onboardingLoading, loadOnboardingStatus } =
    useOnboardingStore();

  useEffect(() => {
    loadTokens();
    loadOnboardingStatus();
  }, [loadTokens, loadOnboardingStatus]);

  useEffect(() => {
    if (authLoading || onboardingLoading) return;

    const inAuth = segments[0] === 'auth';
    const inOnboarding = segments[0] === 'onboarding';

    if (!hasCompletedOnboarding && !inOnboarding) {
      router.replace('/onboarding');
    } else if (hasCompletedOnboarding && !isAuthenticated && !inAuth) {
      router.replace('/auth');
    } else if (isAuthenticated && (inAuth || inOnboarding)) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, hasCompletedOnboarding, authLoading, onboardingLoading, segments, router]);

  if (authLoading || onboardingLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-dark">
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-surface-dark">
        <StatusBar style="light" />
        <AuthGate>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#0A0A0F' },
              animation: 'slide_from_right',
            }}
          />
        </AuthGate>
      </View>
    </GestureHandlerRootView>
  );
}
