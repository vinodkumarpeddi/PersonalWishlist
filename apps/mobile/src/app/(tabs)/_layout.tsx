import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { WText } from '../../components/ui';

function TabIcon({ label, focused, emoji }: { label: string; focused: boolean; emoji: string }) {
  return (
    <View className="items-center pt-1.5 gap-1">
      <View
        className={`w-10 h-10 rounded-2xl items-center justify-center ${
          focused ? 'bg-brand/15' : 'bg-transparent'
        }`}
      >
        <WText style={{ fontSize: 18, opacity: focused ? 1 : 0.4 }}>{emoji}</WText>
      </View>
      <WText
        variant="caption"
        className={`text-[10px] font-semibold ${focused ? 'text-brand-light' : 'text-muted'}`}
      >
        {label}
      </WText>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#0D0D15',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.04)',
          height: 88,
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Wishlist" focused={focused} emoji="💜" />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Discover" focused={focused} emoji="🔍" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Profile" focused={focused} emoji="👤" />
          ),
        }}
      />
    </Tabs>
  );
}
