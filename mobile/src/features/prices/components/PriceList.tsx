import React, { useCallback, useState } from 'react';
import { View, Text, RefreshControl, Alert, TouchableOpacity } from 'react-native'; // Alert eklendi
// @ts-ignore
import { FlashList } from '@shopify/flash-list';
import { usePrices } from '../api/usePrices';
import { PriceCard } from './PriceCard';
import { GoldPrice } from '../types';
import { theme } from '@/src/core/theme';
import * as Haptics from 'expo-haptics';
import { SkeletonPriceCard } from '@/src/features/prices/components/SkeletonPriceCard';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

export const PriceList = () => {
  const { data: prices, isLoading, isError, refetch } = usePrices();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);

    try {
      const result = await refetch();

      // Eğer backend bizim 503 hata mesajımızı döndürdüyse (uyanma durumu)
      if (result.isError) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert(
          "Sunucular Uyanıyor",
          "Sistem uzun süre işlem yapılmadığı için uyku modundaydı. Arka planda uyandırılıyor, lütfen 15-20 saniye sonra tekrar yenileyin."
        );
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // DİKKAT: Sadece elimizde hiç fiyat yoksa (ilk açılışta) loading göster.
  // Yenileme yaparken zaten verimiz olduğu için burası çalışmaz, ekran boşalmaz.
  if (isLoading && (!prices || (prices as GoldPrice[]).length === 0)) {
    return (
      <View className="flex-1 bg-background px-4 pt-4">
        {/* Başlık kısmı iskelet yüklenirken de sabit kalsın ki ekran zıplamasın */}
        <View className="mb-6 mt-2">
          <Text className="text-3xl font-extrabold text-text-primary">
            Kıymetli Madenler
          </Text>
          <Text className="text-text-secondary mt-1">
            Saatlik güncellenen fiyatlar
          </Text>
        </View>

        {/* 6 tane nefes alan iskelet kartı alt alta diziyoruz */}
        {[1, 2, 3, 4, 5, 6].map((key) => (
          <SkeletonPriceCard key={key} />
        ))}
      </View>
    );
  }

  // Sadece elimizde hiç veri yoksa tam ekran hata göster.
  if (isError && (!prices || prices.length === 0)) {
    return (
      <View className="flex-1 items-center justify-center p-4 bg-background">
        <Text className="text-red-500 text-center mb-4">
          Sunuculara bağlanılamadı.
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="bg-primary px-6 py-2 rounded-full"
        >
          <Text className="text-black font-bold">Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4 pt-4">

      <FlashList
        data={prices || []}
        renderItem={({ item, index }: { item: GoldPrice; index: number }) => (
          <PriceCard price={item} index={index} />
        )}
        keyExtractor={(item: GoldPrice) => item.gold_type}
        // @ts-ignore
        estimatedItemSize={88}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.light.primary}
            colors={[theme.light.primary]}
          />
        }
        ListHeaderComponent={
          <View>
            <Text className="text-3xl font-extrabold text-text-primary">
              Kıymetli Madenler
            </Text>
            <Text className="text-text-secondary mt-1 mb-4">
              Saatlik güncellenen fiyatlar
            </Text>

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
          </View>
        }
      />

    </View>
  );
};