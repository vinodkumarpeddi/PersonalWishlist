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
        <View className="w-14 h-14 rounded-full bg-brand/10 items-center justify-center mb-3">
          <WText style={{ fontSize: 24 }}>📊</WText>
        </View>
        <WText variant="body" className="font-medium mb-1">No Price History</WText>
        <WText variant="caption" className="text-muted text-center">
          Prices will be tracked over time{'\n'}as we check for updates
        </WText>
      </View>
    );
  }

  const prices = data.map((d) => d.pricePaise);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;
  const chartHeight = 120;
  const displayData = data.slice(-30);

  return (
    <View>
      {/* Bar chart */}
      <View className="flex-row items-end gap-0.5 rounded-xl bg-white/3 p-3" style={{ height: chartHeight + 24 }}>
        {displayData.map((point, i) => {
          const height = Math.max(8, ((point.pricePaise - minPrice) / range) * chartHeight);
          const isLatest = i === displayData.length - 1;
          const isLowest = point.pricePaise === minPrice;

          return (
            <View
              key={point._id || i}
              className={`flex-1 rounded-t-md ${
                isLatest ? 'bg-brand' : isLowest ? 'bg-success/50' : 'bg-brand/25'
              }`}
              style={{ height }}
            />
          );
        })}
      </View>

      {/* Min/Max/Current labels */}
      <View className="flex-row justify-between mt-4">
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5 mb-1">
            <View className="w-2 h-2 rounded-full bg-success" />
            <WText variant="caption" className="text-muted">Lowest</WText>
          </View>
          <WText variant="body" className="text-success font-semibold">
            {formatPrice(minPrice)}
          </WText>
        </View>
        <View className="flex-1 items-center">
          <View className="flex-row items-center gap-1.5 mb-1">
            <View className="w-2 h-2 rounded-full bg-brand" />
            <WText variant="caption" className="text-muted">Current</WText>
          </View>
          <WText variant="body" className="text-white font-semibold">
            {formatPrice(prices[prices.length - 1])}
          </WText>
        </View>
        <View className="flex-1 items-end">
          <View className="flex-row items-center gap-1.5 mb-1">
            <View className="w-2 h-2 rounded-full bg-danger" />
            <WText variant="caption" className="text-muted">Highest</WText>
          </View>
          <WText variant="body" className="text-danger font-semibold">
            {formatPrice(maxPrice)}
          </WText>
        </View>
      </View>
    </View>
  );
}
