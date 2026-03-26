// Represents the individual gold/silver price fetched from the backend
export interface GoldPrice {
  id: number;
  gold_type: 'gram' | 'ceyrek' | 'yarim' | 'tam' | 'gumus';
  price_buy: string; // Decimal strings from backend
  price_sell: string;
  created_at: string; // ISO Datetime string
  previous_price_buy?: string | null;
  previous_price_sell?: string | null;
}

import { MaterialCommunityIcons } from '@expo/vector-icons';

// Maps the short code from backend to readable Turkish names and Tailwind colors for the UI
export const GoldTypeDetails: Record<
  GoldPrice['gold_type'],
  { label: string; iconBaseColor: string; iconName: keyof typeof MaterialCommunityIcons.glyphMap }
> = {
  gram: { label: 'Gram Altın', iconBaseColor: 'bg-yellow-400', iconName: 'gold' },
  ceyrek: { label: 'Çeyrek Altın', iconBaseColor: 'bg-yellow-500', iconName: 'chart-pie' },
  yarim: { label: 'Yarım Altın', iconBaseColor: 'bg-amber-500', iconName: 'circle-slice-4' },
  tam: { label: 'Cumhuriyet \nAltını', iconBaseColor: 'bg-amber-600', iconName: 'circle-multiple' },
  gumus: { label: 'Gümüş', iconBaseColor: 'bg-slate-200', iconName: 'gold' },
};
