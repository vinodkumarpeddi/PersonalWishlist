import '../global.css';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator, Platform } from 'react-native';
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

function MobileFrame({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== 'web') return <>{children}</>;

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
      }}
    >
      <View
        style={{
          width: 390,
          height: 844,
          borderRadius: 40,
          overflow: 'hidden',
          borderWidth: 3,
          borderColor: '#2A2A35',
          // @ts-expect-error web-only shadow
          boxShadow: '0 0 60px rgba(108, 92, 231, 0.3)',
        }}
      >
        {children}
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MobileFrame>
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
      </MobileFrame>
    </GestureHandlerRootView>
  );
}
