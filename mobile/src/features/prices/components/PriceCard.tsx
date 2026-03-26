import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GoldPrice, GoldTypeDetails } from '../types';

interface PriceCardProps {
  price: GoldPrice;
  index: number;
}

export const PriceCard: React.FC<PriceCardProps> = ({ price, index }) => {
  const details = GoldTypeDetails[price.gold_type] || {
    label: price.gold_type,
    iconBaseColor: 'bg-surface', 
    iconName: 'circle',
  };

  // Helper function to calculate trend
  const getTrend = (currentStr: string, prevStr?: string | null) => {
    if (!prevStr) return 'neutral';
    
    const current = parseFloat(currentStr);
    const prev = parseFloat(prevStr);
    
    if (current > prev) return 'up';
    if (current < prev) return 'down';
    return 'neutral';
  };

  // Backend'den gelen önceki fiyatlarla kıyaslıyoruz
  const buyTrend = getTrend(price.price_buy, price.previous_price_buy);
  const sellTrend = getTrend(price.price_sell, price.previous_price_sell);

  // Helper function for colors
  const getTrendColor = (trend: string, defaultColor: string) => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return defaultColor;
  };

  // Helper function for icons
  const renderTrendIcon = (trend: string) => {
    if (trend === 'up') return <MaterialCommunityIcons name="trending-up" size={18} color="#22c55e" />;
    if (trend === 'down') return <MaterialCommunityIcons name="trending-down" size={18} color="#ef4444" />;
    return null;
  };

  // Helper function to calculate percentage change
  const getPercentageChange = (currentStr: string, prevStr?: string | null) => {
    if (!prevStr) return null;
    
    const current = parseFloat(currentStr);
    const prev = parseFloat(prevStr);
    
    if (isNaN(current) || isNaN(prev) || prev === 0) return null;
    
    const change = ((current - prev) / prev) * 100;
    return Math.abs(change).toFixed(2);
  };

  const buyPercentage = getPercentageChange(price.price_buy, price.previous_price_buy);
  const sellPercentage = getPercentageChange(price.price_sell, price.previous_price_sell);

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).duration(400)}
      className="flex-row items-center justify-between py-6 px-4 mb-3 rounded-2xl bg-surface shadow-sm border border-border"
    >
      {/* Icon & Title */}
      <View className="flex-row items-center space-x-4">
        <View className={`w-12 h-12 rounded-full items-center justify-center ${details.iconBaseColor} shadow-sm border border-border`}>
          <MaterialCommunityIcons name={details.iconName} size={20} />
        </View>
        <View>
          <Text className="text-text-primary font-bold text-lg ps-2">
            {details.label}
          </Text>
          <Text className="text-text-secondary text-xs mt-0.5 ps-2">
            {new Date(price.created_at).toLocaleTimeString('tr-TR', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            })}
          </Text>
        </View>
      </View>

      {/* Prices */}
      <View className="items-end">
        {/* Buy Price */}
        <View className="flex-row items-center mt-1">
          <Text className="text-text-secondary text-xs pe-2">Bozdur</Text>
          <View className="flex-row items-center">
            {renderTrendIcon(buyTrend)}
            {buyPercentage && buyTrend !== 'neutral' && (
              <Text className={`text-[10px] ml-0.5 ${getTrendColor(buyTrend, 'text-text-secondary')}`}>
                (%{buyPercentage})
              </Text>
            )}
            <Text className={`font-bold text-base ml-1 ${getTrendColor(buyTrend, 'text-text-primary')}`}>
              ₺{price.price_buy}
            </Text>
          </View>
        </View>

        {/* Sell Price */}
        <View className="flex-row items-center mt-1">
          <Text className="text-text-secondary text-xs pe-2">Satın Al</Text>
          <View className="flex-row items-center">
            {renderTrendIcon(sellTrend)}
            {sellPercentage && sellTrend !== 'neutral' && (
              <Text className={`text-[10px] ml-0.5 ${getTrendColor(sellTrend, 'text-text-secondary')}`}>
                (%{sellPercentage} )
              </Text>
            )}
            <Text className={`font-extrabold text-base ml-1 ${getTrendColor(sellTrend, 'text-primary')}`}>
              ₺{price.price_sell}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};