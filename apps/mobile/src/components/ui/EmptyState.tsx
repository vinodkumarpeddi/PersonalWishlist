import { View } from 'react-native';
import { WText } from './WText';
import { WButton } from './WButton';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      {icon && <View className="mb-6">{icon}</View>}
      <WText variant="h3" className="text-center mb-2">
        {title}
      </WText>
      <WText variant="bodySmall" className="text-center mb-8">
        {description}
      </WText>
      {actionLabel && onAction && (
        <WButton title={actionLabel} onPress={onAction} variant="primary" size="md" />
      )}
    </View>
  );
}
