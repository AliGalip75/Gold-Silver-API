import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { useWalletStore } from '../store/walletStore';
import { usePrices } from '../../prices/api/usePrices';
import { GoldTypeDetails } from '../../prices/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AssetInputModal } from '@/src/features/wallet/components/AssetInputModal';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { theme } from '@/src/core/theme'; 
import { PieChart } from 'react-native-gifted-charts';
import { useColorScheme } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export const WalletDashboard = () => {
  const { assets } = useWalletStore();
  const { data: prices, isLoading, refetch } = usePrices();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const rotation = useSharedValue(0);

  useEffect(() => {
    // 360 derece dönerek oluşması için animasyon
    rotation.value = 0;
    rotation.value = withTiming(360, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });
  }, [refreshing]);

  const animatedChartStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // Use primary color variations from theme instead of hardcoded hex values
  const chartProps: Record<string, { svgColor: string, twClass: string }> = {
    gram: { svgColor: '#FACC15', twClass: 'bg-yellow-400' },
    ceyrek: { svgColor: '#EAB308', twClass: 'bg-yellow-500' }, 
    yarim: { svgColor: '#F59E0B', twClass: 'bg-amber-500' }, 
    tam: { svgColor: '#D97706', twClass: 'bg-amber-600' },
    gumus: { svgColor: '#E2E8F0', twClass: 'bg-slate-200' }, 
  };

  const totalValue = useMemo(() => {
    if (!prices) return 0;
    
    return Object.entries(assets).reduce((total, [type, amount]) => {
      const priceObj = prices.find((p) => p.gold_type === type);
      if (priceObj && amount > 0) {
        return total + (parseFloat(priceObj.price_buy) * amount);
      }
      return total;
    }, 0);
  }, [assets, prices]);

  const pieData = useMemo(() => {
    if (!prices) return [];
    
    return Object.entries(assets)
      .filter(([_, amount]) => amount > 0)
      .map(([type, amount]) => {
        const priceObj = prices.find((p) => p.gold_type === type);
        const assetValue = priceObj ? parseFloat(priceObj.price_buy) * amount : 0;
        // @ts-ignore
        const details = GoldTypeDetails[type] || { label: type };
        const mapping = chartProps[type] || { svgColor: theme.light.border, twClass: 'bg-border' };
        
        return {
          value: assetValue,
          color: mapping.svgColor, 
          colorClass: mapping.twClass, 
          label: details.label,
          type: type,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [assets, prices]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const hasAssets = Object.values(assets).some(amount => amount > 0);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={theme.light.primary} 
            colors={[theme.light.primary]} 
          />
        }
      >
        {/* Header & Total Value */}
        <Animated.View entering={FadeIn.duration(500)} className="px-6 pt-4 pb-6 bg-surface rounded-b-3xl shadow-sm">
          <Text className="text-text-secondary font-medium mb-1">Toplam Varlık Değeri</Text>
          <View className="flex-row items-end">
            <Text className="text-4xl font-extrabold text-text-primary tracking-tight">
              ₺{totalValue.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
          {isLoading && <Text className="text-primary text-xs mt-2">Güncel fiyatlar yükleniyor...</Text>}
        </Animated.View>

        {/* Assets List */}
        <View className="px-4 pt-6 flex-1">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-text-primary">Varlıklarım</Text>
            <TouchableOpacity 
              onPress={() => setModalVisible(true)}
              className="bg-primary px-3 py-1.5 rounded-full flex-row items-center"
            >
              <MaterialCommunityIcons name="plus" size={16} color={isDark ? theme.dark.background : theme.light.background} />
              <Text className="text-background font-bold ml-2 text-sm font-sans">Düzenle</Text>
            </TouchableOpacity>
          </View>

          {!hasAssets ? (
            <View key="empty-wallet" className="items-center justify-center py-12">
              <MaterialCommunityIcons name="wallet-outline" size={64} color={theme.light.border} />
              <Text className="text-text-secondary mt-4 text-center">
                Henüz cüzdanınıza bir varlık eklemediniz. İlerlemeyi görmek için yukarıdaki butondan ekleyin.
              </Text>
            </View>
          ) : (
            <View key="wallet-assets" className="items-center bg-surface rounded-3xl p-6 shadow-sm border border-border mt-2">
              <View className="relative items-center justify-center">
                <Animated.View style={animatedChartStyle}>
                  <PieChart
                    donut
                    radius={110}
                    innerRadius={80}
                    data={pieData}
                    innerCircleColor={isDark ? theme.dark.surface : theme.light.surface}
                    isAnimated
                    animationDuration={600}
                    focusOnPress // Optional: Adds interaction
                  />
                </Animated.View>
                
                {/* Sabit merkez yazısı (chart ile dönmemesi için dışarıya aldık) */}
                <View className="absolute items-center justify-center" pointerEvents="none">
                  <Text className="text-text-secondary text-xs">Toplam</Text>
                  <Text className="text-text-primary text-xl font-bold">
                    ₺{totalValue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                  </Text>
                </View>
              </View>
              
              {/* Custom Legend */}
              <View className="w-full mt-2">
                {pieData.map((item, index) => (
                  <View key={index} className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <View className={`w-4 h-4 rounded-full mr-3 ${item.colorClass}`} />
                      <Text className="text-text-primary font-medium">{item.label}</Text>
                      <Text className="text-text-secondary text-xs ml-2">
                        ({assets[item.type as keyof typeof assets]} {item.type === 'gumus' ? 'Gr' : 'Adet'})
                      </Text>
                    </View>
                    <Text className="text-text-primary font-bold">
                      ₺{item.value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            
          )}
        </View>
      </ScrollView>

      {/* AdMob Banner inside the list header */}
      <View className="items-center justify-center py-2 rounded-xl overflow-hidden min-h-[60px] w-full">
        <BannerAd
          unitId={TestIds.BANNER}
          size={BannerAdSize.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>

      <AssetInputModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
      />
    </View>
  );
};