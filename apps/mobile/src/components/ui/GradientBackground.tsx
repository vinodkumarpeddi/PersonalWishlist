import { View, type ViewProps } from 'react-native';

interface GradientBackgroundProps extends ViewProps {
  variant?: 'default' | 'brand' | 'accent';
}

export function GradientBackground({
  variant = 'default',
  className = '',
  children,
  ...props
}: GradientBackgroundProps) {
  return (
    <View className={`flex-1 bg-surface-dark ${className}`} {...props}>
      {/* Top-left glow */}
      <View
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20"
        style={{
          backgroundColor: variant === 'accent' ? '#00D2D3' : '#6C5CE7',
          // @ts-expect-error web filter
          filter: 'blur(80px)',
        }}
      />
      {/* Bottom-right glow */}
      <View
        className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-10"
        style={{
          backgroundColor: variant === 'brand' ? '#6C5CE7' : '#00D2D3',
          // @ts-expect-error web filter
          filter: 'blur(80px)',
        }}
      />
      {children}
    </View>
  );
}
