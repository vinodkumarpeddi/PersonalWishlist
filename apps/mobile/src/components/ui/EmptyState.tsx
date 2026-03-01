import { View } from 'react-native';
import { WText } from './WText';
import { WButton } from './WButton';

interface EmptyStateProps {
  emoji?: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ emoji, icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-10 py-16">
      {emoji && (
        <View className="w-24 h-24 rounded-full bg-brand/10 items-center justify-center mb-6">
          <WText variant="h1" style={{ fontSize: 44 }}>
            {emoji}
          </WText>
        </View>
      )}
      {icon && !emoji && <View className="mb-6">{icon}</View>}
      <WText variant="h3" className="text-center mb-3">
        {title}
      </WText>
      <WText variant="bodySmall" className="text-center leading-6 mb-8">
        {description}
      </WText>
      {actionLabel && onAction && (
        <WButton title={actionLabel} onPress={onAction} variant="primary" size="md" />
      )}
    </View>
  );
}
