import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkvStorage';
import { GoldPrice } from '../../prices/types';

export interface WalletState {
  assets: Record<GoldPrice['gold_type'], number>;
  updateAsset: (type: GoldPrice['gold_type'], amount: number) => void;
  updateAssets: (newAssets: Partial<Record<GoldPrice['gold_type'], number>>) => void;
  removeAsset: (type: GoldPrice['gold_type']) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      assets: {
        gram: 0,
        ceyrek: 0,
        yarim: 0,
        tam: 0,
        gumus: 0,
      },
      updateAsset: (type, amount) => {
        set((state) => {
          return {
            assets: {
              ...state.assets,
              [type]: Math.max(0, amount), // Prevent negative assets
            },
          };
        });
      },
      updateAssets: (newAssets) =>
        set((state) => {
          const updatedAssets = { ...state.assets };
          Object.entries(newAssets).forEach(([type, amount]) => {
            if (amount !== undefined) {
              updatedAssets[type as GoldPrice['gold_type']] = Math.max(0, amount);
            }
          });
          return { assets: updatedAssets };
        }),
      removeAsset: (type) =>
        set((state) => ({
          assets: {
            ...state.assets,
            [type]: 0,
          },
        })),
    }),
    {
      name: 'aurum-wallet-storage',
      storage: createJSONStorage(() => mmkvStorage),
      onRehydrateStorage: () => (state) => {
        console.log('[walletStore] onRehydrateStorage called, state hydrated:', !!state);
      }
    }
  )
);
