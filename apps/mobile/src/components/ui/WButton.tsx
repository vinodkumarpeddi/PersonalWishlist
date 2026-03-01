import { ActivityIndicator, View } from 'react-native';
import { WText } from './WText';
import { AnimatedPressable } from './AnimatedPressable';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand',
  secondary: 'bg-surface-light border border-surface',
  outline: 'border-2 border-brand/50 bg-brand/5',
  ghost: 'bg-transparent',
  danger: 'bg-danger/90',
};

const variantTextClasses: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-white',
  outline: 'text-brand-light',
  ghost: 'text-brand-light',
  danger: 'text-white',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-5 py-2.5 rounded-xl',
  md: 'px-6 py-3.5 rounded-2xl',
  lg: 'px-8 py-4 rounded-2xl',
};

const sizeTextClasses: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

interface WButtonProps {
  title: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  onPress?: () => void;
}

export function WButton({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  onPress,
}: WButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      scaleDown={0.97}
      className={`flex-row items-center justify-center ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${isDisabled ? 'opacity-40' : ''}`}
      style={
        variant === 'primary' && !isDisabled
          ? {
              // @ts-expect-error web shadow
              boxShadow: '0 4px 24px rgba(108, 92, 231, 0.35)',
            }
          : undefined
      }
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <View className="flex-row items-center gap-2.5">
          {icon}
          <WText
            variant="body"
            className={`font-semibold tracking-wide ${variantTextClasses[variant]} ${sizeTextClasses[size]}`}
          >
            {title}
          </WText>
        </View>
      )}
    </AnimatedPressable>
  );
}
