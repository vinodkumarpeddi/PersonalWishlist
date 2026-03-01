import { View } from 'react-native';
import { WText } from './WText';
import { AnimatedPressable } from './AnimatedPressable';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function Chip({ label, selected = false, onPress }: ChipProps) {
  return (
    <AnimatedPressable onPress={onPress}>
      <View
        className={`rounded-full px-4 py-2 border ${
          selected ? 'bg-brand border-brand' : 'bg-surface border-surface-light'
        }`}
      >
        <WText
          variant="bodySmall"
          className={`font-medium ${selected ? 'text-white' : 'text-muted-light'}`}
        >
          {label}
        </WText>
      </View>
    </AnimatedPressable>
  );
}
