import { View } from 'react-native';
import { WText } from '../../components/ui';

export default function DiscoverScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-surface-dark">
      <WText variant="h2">Discover</WText>
      <WText variant="bodySmall" className="mt-2">
        Coming soon
      </WText>
    </View>
  );
}
