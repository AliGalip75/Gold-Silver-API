import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/src/core/theme'; // Yolun doğruluğundan emin ol
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Geçerli temayı tek bir değişkende tutarak kodu sadeleştiriyoruz
  const currentTheme = isDark ? theme.dark : theme.light;

  return (
    <Tabs
      screenOptions={{
        // Aktif sekme rengi (Altın sarısı)
        tabBarActiveTintColor: currentTheme.primary,
        // Pasif sekme rengi (Gri)
        tabBarInactiveTintColor: currentTheme.textSecondary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          // Alt menü arkaplanı (Aydınlıkta beyaz, karanlıkta koyu gri)
          backgroundColor: currentTheme.surface,
          borderTopWidth: 1,
          height: 105,
          // Çizgi rengi
          borderTopColor: currentTheme.border,
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
          ...Platform.select({
            ios: {
              position: 'absolute', // Helps with blur effect on iOS if used later
            },
          }),
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Piyasalar',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={26} name="chart-line-variant" color={color} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Cüzdanım',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={26} name="wallet-bifold-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}