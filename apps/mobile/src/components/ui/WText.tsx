import { Text, type TextProps } from 'react-native';

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption' | 'label';

const variantClasses: Record<Variant, string> = {
  h1: 'text-3xl font-bold text-white',
  h2: 'text-2xl font-bold text-white',
  h3: 'text-xl font-semibold text-white',
  body: 'text-base text-white',
  bodySmall: 'text-sm text-muted-light',
  caption: 'text-xs text-muted',
  label: 'text-sm font-medium text-muted-light',
};

interface WTextProps extends TextProps {
  variant?: Variant;
}

export function WText({ variant = 'body', className = '', ...props }: WTextProps) {
  return <Text className={`${variantClasses[variant]} ${className}`} {...props} />;
}
