import React from 'react';
import { View } from 'react-native';
import { WalletDashboard } from '@/src/features/wallet/components/WalletDashboard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WalletScreen() {
  return (
    <SafeAreaView 
      className="flex-1 bg-background"
      edges={['top']}
    >
      <WalletDashboard />
    </SafeAreaView>
  );
}
