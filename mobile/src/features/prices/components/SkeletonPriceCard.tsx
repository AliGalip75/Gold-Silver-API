import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export const SkeletonPriceCard = () => {
  // Animasyon için opaklık değeri (0.4 ile 1.0 arasında gidip gelecek)
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    // Nefes alma (pulsing) efekti: Sürekli tekrarla
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.4, { duration: 800 })
      ),
      -1, // Sonsuz döngü
      true // İleri-geri yap (Reverse)
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={animatedStyle}
      className="flex-row items-center justify-between py-6 px-4 mb-3 rounded-2xl bg-surface shadow-sm border border-border"
    >
      {/* Sol Kısım: İkon ve Başlık İskeleti */}
      <View className="flex-row items-center space-x-4">
        {/* İkon Yuvarlağı */}
        <View className="w-12 h-12 rounded-full bg-border" />
        <View>
          {/* Başlık Çubuğu */}
          <View className="w-24 h-5 rounded-md bg-border" />
          {/* Saat Çubuğu */}
          <View className="w-16 h-3 rounded-md bg-border mt-2" />
        </View>
      </View>

      {/* Sağ Kısım: Fiyat İskeletleri */}
      <View className="items-end">
        {/* Bozdur Fiyatı Çubuğu */}
        <View className="w-20 h-4 rounded-md bg-border" />
        {/* Satın Al Fiyatı Çubuğu */}
        <View className="w-24 h-5 rounded-md bg-border mt-2" />
      </View>
    </Animated.View>
  );
};