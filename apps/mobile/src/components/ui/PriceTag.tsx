import { View } from 'react-native';
import { WText } from './WText';
import { Badge } from './Badge';
import { formatPrice, calcDiscount } from '@wishpal/shared';

interface PriceTagProps {
  currentPricePaise: number;
  originalPricePaise?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: { current: 'text-sm', original: 'text-xs' },
  md: { current: 'text-lg', original: 'text-sm' },
  lg: { current: 'text-2xl', original: 'text-base' },
};

export function PriceTag({
  currentPricePaise,
  originalPricePaise,
  currency = 'INR',
  size = 'md',
}: PriceTagProps) {
  const discount = originalPricePaise ? calcDiscount(currentPricePaise, originalPricePaise) : 0;
  const classes = sizeClasses[size];

  return (
    <View className="flex-row items-center gap-2">
      <WText variant="body" className={`font-bold text-white ${classes.current}`}>
        {formatPrice(currentPricePaise, currency)}
      </WText>
      {originalPricePaise && originalPricePaise > currentPricePaise && (
        <>
          <WText variant="caption" className={`line-through text-muted ${classes.original}`}>
            {formatPrice(originalPricePaise, currency)}
          </WText>
          {discount > 0 && <Badge label={`${discount}% off`} variant="success" />}
        </>
      )}
    </View>
  );
}
