import React from 'react';
import { View } from 'react-native';
import { PriceList } from '../../src/features/prices/components/PriceList';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  return (
    // dark: prefixleri ve hardcoded slate renkleri tamamen silindi
    <View className="flex-1 bg-background">
      {/* 'auto' sayesinde tema değiştikçe yazılar otomatik siyah/beyaz olur */}
      <StatusBar style="auto" /> 
      {/* SafeAreaView is usually handled by Expo Router or React Navigation, 
        but we add pt-12 to clear the notch/status bar area for a clean premium look 
      */}
      <View className="flex-1 pt-12">
        <PriceList />
      </View>
    </View>
  );
}