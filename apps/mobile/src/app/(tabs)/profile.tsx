import { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { WText, WCard, Avatar, WButton, AnimatedPressable, GradientBackground } from '../../components/ui';
import { useAuthStore } from '../../stores/auth-store';
import { apiClient } from '../../services/api-client';
import type { User } from '@wishpal/shared';

interface Stats {
  totalItems: number;
  byPriority: Record<string, number>;
}

function SettingsRow({ label, value, emoji, onPress }: { label: string; value?: string; emoji?: string; onPress?: () => void }) {
  return (
    <AnimatedPressable onPress={onPress} disabled={!onPress}>
      <View className="flex-row items-center justify-between py-3.5 border-b border-white/5">
        <View className="flex-row items-center gap-3">
          {emoji && (
            <View className="w-8 h-8 rounded-xl bg-white/5 items-center justify-center">
              <WText style={{ fontSize: 14 }}>{emoji}</WText>
            </View>
          )}
          <WText variant="body">{label}</WText>
        </View>
        <View className="flex-row items-center gap-2">
          {value && <WText variant="bodySmall" className="text-muted">{value}</WText>}
          {onPress && <WText variant="bodySmall" className="text-muted">›</WText>}
        </View>
      </View>
    </AnimatedPressable>
  );
}

function StatCard({ value, label, emoji, delay }: { value: number; label: string; emoji: string; delay: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()} className="flex-1">
      <WCard className="items-center gap-2">
        <View className="w-10 h-10 rounded-2xl bg-brand/10 items-center justify-center">
          <WText style={{ fontSize: 18 }}>{emoji}</WText>
        </View>
        <WText variant="h2" className="text-brand">{value}</WText>
        <WText variant="caption">{label}</WText>
      </WCard>
    </Animated.View>
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
    <GradientBackground style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header label */}
        <View className="px-5 pt-4">
          <WText variant="overline" className="text-accent mb-1">ACCOUNT</WText>
          <WText variant="h2">Profile</WText>
        </View>

        {/* Profile Card */}
        <Animated.View entering={FadeInDown.delay(100).springify()} className="px-5 mt-5">
          <WCard className="items-center py-6">
            <View className="mb-4">
              <Avatar
                uri={displayUser?.avatarUrl}
                name={displayUser?.name || displayUser?.phone}
                size="xl"
              />
              <View className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-success border-2 border-surface-dark items-center justify-center">
                <WText style={{ fontSize: 10 }}>✓</WText>
              </View>
            </View>
            <WText variant="h3" className="mt-1">
              {displayUser?.name || 'WishPal User'}
            </WText>
            <View className="flex-row items-center gap-1.5 mt-1.5">
              <View className="w-1.5 h-1.5 rounded-full bg-success" />
              <WText variant="bodySmall" className="text-muted">
                {displayUser?.phone || '+91 •••• ••••'}
              </WText>
            </View>
          </WCard>
        </Animated.View>

        {/* Stats Cards */}
        <View className="flex-row px-5 gap-3 mt-4">
          <StatCard
            value={stats?.totalItems || 0}
            label="Saved"
            emoji="💜"
            delay={200}
          />
          <StatCard
            value={stats?.byPriority?.urgent || 0}
            label="Urgent"
            emoji="🔥"
            delay={250}
          />
          <StatCard
            value={stats?.byPriority?.high || 0}
            label="High"
            emoji="⚡"
            delay={300}
          />
        </View>

        {/* Account Settings */}
        <Animated.View entering={FadeInDown.delay(350).springify()} className="px-5 mt-5">
          <WText variant="overline" className="text-muted mb-2 px-1">ACCOUNT</WText>
          <WCard>
            <SettingsRow label="Name" value={displayUser?.name || 'Not set'} emoji="👤" />
            <SettingsRow label="Phone" value={displayUser?.phone} emoji="📱" />
            <SettingsRow label="Currency" value={displayUser?.currency || 'INR'} emoji="💰" />
          </WCard>
        </Animated.View>

        {/* App Settings */}
        <Animated.View entering={FadeInDown.delay(400).springify()} className="px-5 mt-4">
          <WText variant="overline" className="text-muted mb-2 px-1">PREFERENCES</WText>
          <WCard>
            <SettingsRow label="Notifications" value="Enabled" emoji="🔔" />
            <SettingsRow label="Price Checks" value="Every 6h" emoji="⏰" />
            <SettingsRow label="Version" value="1.0.0" emoji="📋" />
          </WCard>
        </Animated.View>

        {/* Sign Out */}
        <Animated.View entering={FadeInDown.delay(450).springify()} className="px-5 mt-6">
          <AnimatedPressable
            onPress={handleSignOut}
            className="w-full py-4 rounded-2xl bg-danger/10 border border-danger/20 items-center justify-center"
          >
            <WText variant="body" className="text-danger font-semibold tracking-wide">
              Sign Out
            </WText>
          </AnimatedPressable>
        </Animated.View>

        {/* Footer */}
        <Animated.View entering={FadeInDown.delay(500).springify()} className="items-center mt-8">
          <WText variant="caption" className="text-muted/50">Made with 💜 by WishPal</WText>
        </Animated.View>
      </ScrollView>
    </GradientBackground>
  );
}
