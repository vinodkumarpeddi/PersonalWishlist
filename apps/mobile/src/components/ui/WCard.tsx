import { View, type ViewProps } from 'react-native';
import { AnimatedPressable } from './AnimatedPressable';

interface WCardProps extends ViewProps {
  onPress?: () => void;
  noPadding?: boolean;
}

export function WCard({ onPress, noPadding = false, className = '', children, ...props }: WCardProps) {
  const baseClasses = `rounded-2xl bg-surface-light border border-surface ${noPadding ? '' : 'p-4'} ${className}`;

  if (onPress) {
    return (
      <AnimatedPressable onPress={onPress} className={baseClasses}>
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <View className={baseClasses} {...props}>
      {children}
    </View>
  );
}
