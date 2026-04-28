import { Platform } from 'react-native';

export interface QuoteData {
  id: string;
  value: number;
  change: number;
  changePercent: number;
  updatedAt: string;
}

export interface AdvanceDecline {
  advance: number;
  decline: number;
  unchanged: number;
}

export interface InvestorData {
  amount: number;
  change: number;
  date: string;
}

export interface FearGreedData {
  score: number;
  rating: string;
  previousClose: number;
}

export interface GlobalMarketData {
  quotes: Record<string, QuoteData>;
  fearGreed: FearGreedData | null;
  fredData: Record<string, QuoteData>;
  fetchedAt: string;
}

export interface KoreaMarketData {
  quotes: Record<string, QuoteData>;
  advanceDecline: Record<string, AdvanceDecline>;
  investorData: Record<string, InvestorData>;
  fetchedAt: string;
}

// Yahoo Finance 심볼 목록
const YAHOO_GLOBAL_SYMBOLS = ['^DJI', '^GSPC', '^IXIC', '^RUT', '^SOX', '^VIX', 'CL=F', 'GC=F', 'DX-Y.NYB', '^IRX', '^TNX', 'KRW=X'];
const YAHOO_KOREA_SYMBOLS = ['^KS11', '^KQ11'];

const SYMBOL_TO_ID: Record<string, string> = {
  '^DJI': 'dji',
  '^GSPC': 'gspc',
  '^IXIC': 'ixic',
  '^RUT': 'rut',
  '^SOX': 'sox',
  '^VIX': 'vix',
  'CL=F': 'wti',
  'GC=F': 'gold',
  'DX-Y.NYB': 'dxy',
  '^IRX': 'us2y',
  '^TNX': 'us10y',
  'KRW=X': 'usdkrw',
  '^KS11': 'kospi',
  '^KQ11': 'kosdaq',
};

// Yahoo Finance v7 batch quote
async function fetchYahooQuotes(symbols: string[]): Promise<Record<string, QuoteData>> {
  const encoded = symbols.map(s => encodeURIComponent(s)).join(',');
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encoded}&lang=ko-KR&region=KR`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Accept: 'application/json',
    },
  });

  if (!res.ok) throw new Error(`Yahoo Finance error: ${res.status}`);

  const json = await res.json();
  const results: any[] = json?.quoteResponse?.result ?? [];
  const out: Record<string, QuoteData> = {};

  for (const r of results) {
    const id = SYMBOL_TO_ID[r.symbol] ?? r.symbol;
    out[id] = {
      id,
      value: r.regularMarketPrice ?? 0,
      change: r.regularMarketChange ?? 0,
      changePercent: r.regularMarketChangePercent ?? 0,
      updatedAt: new Date((r.regularMarketTime ?? Date.now() / 1000) * 1000).toISOString(),
    };
  }
  return out;
}

// FRED API — 2년/10년/TIPS/HY Spread
async function fetchFredSeries(
  seriesId: string,
  id: string,
  apiKey: string,
): Promise<QuoteData | null> {
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&limit=5&sort_order=desc&file_type=json`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  const obs: { date: string; value: string }[] = json?.observations ?? [];
  const valid = obs.filter(o => o.value !== '.' && !isNaN(parseFloat(o.value)));
  if (valid.length < 2) return null;
  const current = parseFloat(valid[0].value);
  const prev = parseFloat(valid[1].value);
  return {
    id,
    value: current,
    change: current - prev,
    changePercent: prev !== 0 ? ((current - prev) / prev) * 100 : 0,
    updatedAt: new Date(valid[0].date).toISOString(),
  };
}

// CNN Fear & Greed
async function fetchFearGreed(): Promise<FearGreedData | null> {
  try {
    const res = await fetch('https://production.dataviz.cnn.io/index/fearandgreed/graphdata', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const fg = json?.fear_and_greed;
    if (!fg) return null;
    return {
      score: Math.round(fg.score ?? 0),
      rating: fg.rating ?? '',
      previousClose: fg.previous_close ?? fg.score,
    };
  } catch {
    return null;
  }
}

// Naver Finance — KOSPI/KOSDAQ 등락
async function fetchNaverAdvanceDecline(market: 'KOSPI' | 'KOSDAQ'): Promise<AdvanceDecline | null> {
  try {
    const res = await fetch(`https://m.stock.naver.com/api/index/${market}/basic`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return {
      advance: json?.riseCount ?? 0,
      decline: json?.fallCount ?? 0,
      unchanged: json?.unchangeCount ?? 0,
    };
  } catch {
    return null;
  }
}

// Supabase Edge Function proxy (for web where direct calls may be CORS-blocked)
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

async function fetchViaEdgeFunction(endpoint: 'global-market' | 'korea-market') {
  if (!SUPABASE_URL) throw new Error('Supabase not configured');
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Edge function error: ${res.status}`);
  return res.json();
}

export async function fetchGlobalMarket(): Promise<GlobalMarketData> {
  // On web, prefer the Edge Function to avoid CORS issues
  if (Platform.OS === 'web' && SUPABASE_URL) {
    try {
      return await fetchViaEdgeFunction('global-market');
    } catch {
      // fall through to direct calls
    }
  }

  const fredApiKey = process.env.EXPO_PUBLIC_FRED_API_KEY ?? '';

  const [yahooQuotes, fearGreed, tips, hySpread] = await Promise.allSettled([
    fetchYahooQuotes(YAHOO_GLOBAL_SYMBOLS),
    fetchFearGreed(),
    fredApiKey ? fetchFredSeries('DFII10', 'tips10y', fredApiKey) : Promise.resolve(null),
    fredApiKey ? fetchFredSeries('BAMLH0A0HYM2', 'hy_spread', fredApiKey) : Promise.resolve(null),
  ]);

  const quotes = yahooQuotes.status === 'fulfilled' ? yahooQuotes.value : {};
  const fredData: Record<string, QuoteData> = {};
  if (tips.status === 'fulfilled' && tips.value) fredData['tips10y'] = tips.value;
  if (hySpread.status === 'fulfilled' && hySpread.value) fredData['hy_spread'] = hySpread.value;

  return {
    quotes,
    fearGreed: fearGreed.status === 'fulfilled' ? fearGreed.value : null,
    fredData,
    fetchedAt: new Date().toISOString(),
  };
}

export async function fetchKoreaMarket(): Promise<KoreaMarketData> {
  if (Platform.OS === 'web' && SUPABASE_URL) {
    try {
      return await fetchViaEdgeFunction('korea-market');
    } catch {
      // fall through
    }
  }

  const [yahooQuotes, kospiAdv, kosdaqAdv] = await Promise.allSettled([
    fetchYahooQuotes(YAHOO_KOREA_SYMBOLS),
    fetchNaverAdvanceDecline('KOSPI'),
    fetchNaverAdvanceDecline('KOSDAQ'),
  ]);

  const quotes = yahooQuotes.status === 'fulfilled' ? yahooQuotes.value : {};
  const advanceDecline: Record<string, AdvanceDecline> = {};
  if (kospiAdv.status === 'fulfilled' && kospiAdv.value) advanceDecline['kospi_adv'] = kospiAdv.value;
  if (kosdaqAdv.status === 'fulfilled' && kosdaqAdv.value) advanceDecline['kosdaq_adv'] = kosdaqAdv.value;

  // KOFIA investor data is T+1; shown as placeholder until backend integration
  const investorData: Record<string, InvestorData> = {};

  return {
    quotes,
    advanceDecline,
    investorData,
    fetchedAt: new Date().toISOString(),
  };
}
