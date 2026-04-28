import { useQuery } from '@tanstack/react-query';
import { fetchKoreaMarket, type KoreaMarketData } from '@/lib/api';

const FIFTEEN_MIN = 15 * 60 * 1000;

export function useKoreanMarket() {
  return useQuery<KoreaMarketData, Error>({
    queryKey: ['koreaMarket'],
    queryFn: fetchKoreaMarket,
    staleTime: FIFTEEN_MIN,
    refetchInterval: FIFTEEN_MIN,
    retry: 2,
  });
}
