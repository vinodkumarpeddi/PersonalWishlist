import { ActivityIndicator, View } from 'react-native';
import { WText } from './WText';
import { AnimatedPressable } from './AnimatedPressable';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand',
  secondary: 'bg-surface-light',
  outline: 'border border-brand bg-transparent',
  ghost: 'bg-transparent',
  danger: 'bg-danger',
};

const variantTextClasses: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-white',
  outline: 'text-brand',
  ghost: 'text-brand-light',
  danger: 'text-white',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 rounded-lg',
  md: 'px-6 py-3 rounded-xl',
  lg: 'px-8 py-4 rounded-xl',
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
      className={`flex-row items-center justify-center ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${isDisabled ? 'opacity-50' : ''}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon}
          <WText
            variant="body"
            className={`font-semibold ${variantTextClasses[variant]} ${sizeTextClasses[size]}`}
          >
            {title}
          </WText>
        </View>
      )}
    </AnimatedPressable>
  );
}
