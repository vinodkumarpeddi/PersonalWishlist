import { View } from 'react-native';
import { Image } from 'expo-image';
import { WText } from './WText';

type Size = 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<Size, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
};

const textSizes: Record<Size, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-lg',
  xl: 'text-2xl',
};

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: Size;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({ uri, name, size = 'md' }: AvatarProps) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        className={`${sizeClasses[size]} rounded-full`}
        contentFit="cover"
        transition={200}
      />
    );
  }

  return (
    <View
      className={`${sizeClasses[size]} rounded-full bg-brand/20 items-center justify-center`}
    >
      <WText variant="body" className={`font-bold text-brand-light ${textSizes[size]}`}>
        {name ? getInitials(name) : '?'}
      </WText>
    </View>
  );
}
