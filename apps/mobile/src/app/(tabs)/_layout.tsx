import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { colors } from '../../constants/theme';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Wishlist: '💜',
    Discover: '🔍',
    Profile: '👤',
  };

  return (
    <View className="items-center">
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icons[name] || '•'}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#12121A',
          borderTopColor: '#1A1A25',
          height: 85,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.brand.DEFAULT,
        tabBarInactiveTintColor: colors.muted.DEFAULT,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ focused }) => <TabIcon name="Wishlist" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused }) => <TabIcon name="Discover" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
