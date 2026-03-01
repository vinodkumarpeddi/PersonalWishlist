import { View } from 'react-native';
import { WText } from '../ui';
import { formatPrice, formatDate } from '@wishpal/shared';
import type { PriceHistory } from '@wishpal/shared';

interface PriceHistoryChartProps {
  data: PriceHistory[];
}

export function PriceHistoryChart({ data }: PriceHistoryChartProps) {
  if (data.length === 0) {
    return (
      <View className="items-center py-8">
        <WText variant="bodySmall">No price history yet</WText>
        <WText variant="caption" className="mt-1">
          Price will be tracked over time
        </WText>
      </View>
    );
  }

  const prices = data.map((d) => d.pricePaise);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;
  const chartHeight = 120;

  return (
    <View>
      {/* Simple bar chart */}
      <View className="flex-row items-end gap-0.5" style={{ height: chartHeight }}>
        {data.slice(-30).map((point, i) => {
          const height = Math.max(8, ((point.pricePaise - minPrice) / range) * chartHeight);
          const isLatest = i === data.slice(-30).length - 1;

          return (
            <View
              key={point._id || i}
              className={`flex-1 rounded-t-sm ${isLatest ? 'bg-brand' : 'bg-brand/30'}`}
              style={{ height }}
            />
          );
        })}
      </View>

      {/* Min/Max labels */}
      <View className="flex-row justify-between mt-3">
        <View>
          <WText variant="caption">Lowest</WText>
          <WText variant="bodySmall" className="text-success font-semibold">
            {formatPrice(minPrice)}
          </WText>
        </View>
        <View className="items-center">
          <WText variant="caption">Current</WText>
          <WText variant="bodySmall" className="text-white font-semibold">
            {formatPrice(prices[prices.length - 1])}
          </WText>
        </View>
        <View className="items-end">
          <WText variant="caption">Highest</WText>
          <WText variant="bodySmall" className="text-danger font-semibold">
            {formatPrice(maxPrice)}
          </WText>
        </View>
      </View>
    </View>
  );
}
