import { useQuery } from '@tanstack/react-query';
import { api } from '@/src/core/api';
import { GoldPrice } from '../types';

const fetchPrices = async (): Promise<GoldPrice[]> => {
  const { data } = await api.get('/prices/latest/');
  return data;
};

// 1 Hour cache, strictly manual refetching (NO auto polling to save device battery)
export const usePrices = () => {
  return useQuery<GoldPrice[], Error>({
    queryKey: ['latest_gold_prices'],
    queryFn: fetchPrices,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchInterval: false, // Strict Rule: No auto-polling
  });
};
