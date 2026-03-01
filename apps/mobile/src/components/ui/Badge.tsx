import { View } from 'react-native';
import { WText } from './WText';
import type { Priority } from '@wishpal/shared';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-surface',
  success: 'bg-success/20',
  warning: 'bg-warning/20',
  danger: 'bg-danger/20',
  info: 'bg-brand/20',
};

const variantTextClasses: Record<BadgeVariant, string> = {
  default: 'text-muted-light',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-brand-light',
};

const priorityVariantMap: Record<Priority, BadgeVariant> = {
  low: 'default',
  medium: 'info',
  high: 'warning',
  urgent: 'danger',
};

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  priority?: Priority;
}

export function Badge({ label, variant, priority }: BadgeProps) {
  const resolvedVariant = priority ? priorityVariantMap[priority] : variant || 'default';

  return (
    <View className={`rounded-full px-3 py-1 ${variantClasses[resolvedVariant]}`}>
      <WText variant="caption" className={`font-medium ${variantTextClasses[resolvedVariant]}`}>
        {label}
      </WText>
    </View>
  );
}
