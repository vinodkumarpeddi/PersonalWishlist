import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-surface-dark">
      <Text className="text-white text-2xl font-bold">WishPal</Text>
      <Text className="text-muted-light mt-2">Your AI Shopping Assistant</Text>
    </View>
  );
}
