import { Text, type TextProps } from 'react-native';

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption' | 'label' | 'overline';

const variantClasses: Record<Variant, string> = {
  h1: 'text-3xl font-bold text-white tracking-tight',
  h2: 'text-2xl font-bold text-white tracking-tight',
  h3: 'text-xl font-semibold text-white',
  body: 'text-base text-white',
  bodySmall: 'text-sm text-muted-light leading-5',
  caption: 'text-xs text-muted leading-4',
  label: 'text-sm font-medium text-muted-light',
  overline: 'text-xs font-bold text-muted uppercase tracking-widest',
};

interface WTextProps extends TextProps {
  variant?: Variant;
}

export function WText({ variant = 'body', className = '', ...props }: WTextProps) {
  return <Text className={`${variantClasses[variant]} ${className}`} {...props} />;
}
