import { View, type ViewProps } from 'react-native';
import { AnimatedPressable } from './AnimatedPressable';

interface WCardProps extends ViewProps {
  onPress?: () => void;
  noPadding?: boolean;
  glow?: boolean;
}

export function WCard({
  onPress,
  noPadding = false,
  glow = false,
  className = '',
  style,
  children,
  ...props
}: WCardProps) {
  const baseClasses = `rounded-3xl bg-surface-light/80 border border-white/5 ${noPadding ? '' : 'p-4'} ${className}`;

  const glowStyle = glow
    ? {
        // @ts-expect-error web shadow
        boxShadow: '0 0 30px rgba(108, 92, 231, 0.12)',
      }
    : undefined;

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        scaleDown={0.98}
        className={baseClasses}
        style={[glowStyle, style]}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <View className={baseClasses} style={[glowStyle, style]} {...props}>
      {children}
    </View>
  );
}
