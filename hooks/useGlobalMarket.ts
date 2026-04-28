import { useQuery } from '@tanstack/react-query';
import { fetchGlobalMarket, type GlobalMarketData } from '@/lib/api';

const FIFTEEN_MIN = 15 * 60 * 1000;

export function useGlobalMarket() {
  return useQuery<GlobalMarketData, Error>({
    queryKey: ['globalMarket'],
    queryFn: fetchGlobalMarket,
    staleTime: FIFTEEN_MIN,
    refetchInterval: FIFTEEN_MIN,
    retry: 2,
  });
}
