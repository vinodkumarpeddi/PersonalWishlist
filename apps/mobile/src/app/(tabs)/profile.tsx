import { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { WText, WCard, Avatar, WButton, AnimatedPressable } from '../../components/ui';
import { useAuthStore } from '../../stores/auth-store';
import { apiClient } from '../../services/api-client';
import type { User } from '@wishpal/shared';

interface Stats {
  totalItems: number;
  byPriority: Record<string, number>;
}

function SettingsRow({ label, value, onPress }: { label: string; value?: string; onPress?: () => void }) {
  return (
    <AnimatedPressable onPress={onPress} disabled={!onPress}>
      <View className="flex-row items-center justify-between py-3.5 border-b border-surface">
        <WText variant="body">{label}</WText>
        <View className="flex-row items-center gap-2">
          {value && <WText variant="bodySmall">{value}</WText>}
          {onPress && <WText variant="bodySmall" className="text-muted">→</WText>}
        </View>
      </View>
    </AnimatedPressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const [profileRes, statsRes] = await Promise.all([
        apiClient.get('/user/profile'),
        apiClient.get('/user/stats'),
      ]);
      setProfile(profileRes.data.data);
      setStats(statsRes.data.data);
    } catch {
      // Use local user data as fallback
    }
  };

  const handleSignOut = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiClient.post('/auth/logout');
          } catch {
            // Continue with local logout
          }
          await clearAuth();
          router.replace('/auth');
        },
      },
    ]);
  }, [clearAuth, router]);

  const displayUser = profile || user;

  return (
    <ScrollView
      className="flex-1 bg-surface-dark"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}
    >
      {/* Profile Header */}
      <Animated.View entering={FadeInDown.delay(100)} className="items-center px-4 pt-6 pb-8">
        <Avatar
          uri={displayUser?.avatarUrl}
          name={displayUser?.name || displayUser?.phone}
          size="xl"
        />
        <WText variant="h2" className="mt-4">
          {displayUser?.name || 'WishPal User'}
        </WText>
        <WText variant="bodySmall" className="mt-1">
          {displayUser?.phone}
        </WText>
      </Animated.View>

      {/* Stats Cards */}
      {stats && (
        <Animated.View entering={FadeInDown.delay(200)} className="flex-row px-4 gap-3 mb-6">
          <WCard className="flex-1 items-center">
            <WText variant="h2" className="text-brand">
              {stats.totalItems}
            </WText>
            <WText variant="caption">Total Items</WText>
          </WCard>
          <WCard className="flex-1 items-center">
            <WText variant="h2" className="text-danger">
              {stats.byPriority?.urgent || 0}
            </WText>
            <WText variant="caption">Urgent</WText>
          </WCard>
          <WCard className="flex-1 items-center">
            <WText variant="h2" className="text-warning">
              {stats.byPriority?.high || 0}
            </WText>
            <WText variant="caption">High Priority</WText>
          </WCard>
        </Animated.View>
      )}

      {/* Settings */}
      <Animated.View entering={FadeInDown.delay(300)} className="px-4">
        <WCard>
          <WText variant="label" className="mb-2">
            Account
          </WText>
          <SettingsRow label="Name" value={displayUser?.name || 'Not set'} />
          <SettingsRow label="Phone" value={displayUser?.phone} />
          <SettingsRow label="Currency" value={displayUser?.currency || 'INR'} />
        </WCard>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400)} className="px-4 mt-4">
        <WCard>
          <WText variant="label" className="mb-2">
            App
          </WText>
          <SettingsRow label="Notifications" value="Enabled" />
          <SettingsRow label="Price Check Interval" value="Every 6 hours" />
          <SettingsRow label="Version" value="1.0.0" />
        </WCard>
      </Animated.View>

      {/* Sign Out */}
      <Animated.View entering={FadeInDown.delay(500)} className="px-4 mt-6">
        <WButton title="Sign Out" onPress={handleSignOut} variant="danger" fullWidth />
      </Animated.View>
    </ScrollView>
  );
}
