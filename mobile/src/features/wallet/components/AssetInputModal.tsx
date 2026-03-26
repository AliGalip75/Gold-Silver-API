import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Modal from 'react-native-modal'; 
import { useWalletStore } from '../store/walletStore';
import { GoldTypeDetails } from '../../prices/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

interface AssetInputModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AssetInputModal: React.FC<AssetInputModalProps> = ({ visible, onClose }) => {
  const { assets, updateAssets } = useWalletStore();
  // Keep local state as strings to allow typing dots and commas freely
  const [localAssets, setLocalAssets] = useState<Record<string, string>>({});
  const insets = useSafeAreaInsets();

  // Convert numbers from store to strings when modal opens
  useEffect(() => {
    if (visible) {
      const initialAssets: Record<string, string> = {};
      Object.entries(assets).forEach(([type, amount]) => {
        initialAssets[type] = amount > 0 ? amount.toString() : '';
      });
      setLocalAssets(initialAssets);
    }
  }, [visible, assets]);

  const handleSave = () => {
    const newAssets: Record<string, number> = {};
    Object.entries(localAssets).forEach(([type, valueStr]) => {
      const num = parseFloat(valueStr.replace(',', '.'));
      const finalAmount = isNaN(num) ? 0 : num;
      newAssets[type] = finalAmount;
    });
    
    // @ts-ignore
    updateAssets(newAssets);
    
    // Titreşim motorunu çalıştır (Başarı hissi - Çift tık gibi hissettirir)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    onClose();
  };

  const updateLocal = (type: string, value: string) => {
    // Allow numbers, dots, and commas
    const cleaned = value.replace(/[^0-9.]/g, '');
    
    setLocalAssets(prev => ({
      ...prev,
      [type]: cleaned
    }));
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true}
      style={{ margin: 0 }} 
      animationIn="slideInRight"
      animationOut="slideOutRight"
      animationInTiming={400}
      animationOutTiming={400}
      backdropOpacity={0.1}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View 
          className="bg-surface flex-1 px-6"
          style={{ 
            paddingTop: insets.top > 0 ? insets.top + 16 : 48,
            paddingBottom: insets.bottom > 0 ? insets.bottom + 16 : 32 
          }}
        >
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-text-primary">Varlıklarını Düzenle</Text>
            <TouchableOpacity onPress={onClose} className="p-2 -mr-2">
              <MaterialCommunityIcons name="close" size={24} color="#737373" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <Text className="text-text-secondary mb-4 text-sm">
              Sahip olduğunuz altın veya gümüş miktarını (gram veya adet) aşağıya girin.
            </Text>

            {Object.entries(GoldTypeDetails).map(([shortCode, details]) => (
              <View key={shortCode} className="flex-row items-center justify-between mb-4 border-b border-border pb-4">
                <View className="flex-row items-center space-x-3 flex-1">
                  <View className="w-10 h-10 rounded-full items-center justify-center bg-surface border border-border">
                    <MaterialCommunityIcons name={details.iconName} size={20} color="#D4AF37" />
                  </View>
                  <Text className="text-text-primary font-semibold text-base ps-2">
                    {details.label}
                  </Text>
                </View>
                
                <View className="w-1/3">
                  <TextInput
                    className="bg-background px-4 py-3 rounded-xl border border-border text-text-primary font-bold text-right"
                    // Use decimal-pad to show dot/comma on the keyboard natively
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor="#737373"
                    value={localAssets[shortCode] || ''}
                    onChangeText={(val) => updateLocal(shortCode, val)}
                  />
                </View>
              </View>
            ))}
          </ScrollView>

          <View className="pt-4">
            <TouchableOpacity 
              onPress={handleSave}
              className="bg-primary py-4 rounded-2xl items-center shadow-sm"
            >
              <Text className="text-background font-bold text-lg">Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};