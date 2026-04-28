// Supabase Edge Function (Deno) — CORS proxy for global market data
// Deploy: supabase functions deploy global-market

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const YAHOO_SYMBOLS = ['^DJI', '^GSPC', '^IXIC', '^RUT', '^SOX', '^VIX', 'CL=F', 'GC=F', 'DX-Y.NYB', '^IRX', '^TNX', 'KRW=X'];

const SYMBOL_TO_ID: Record<string, string> = {
  '^DJI': 'dji', '^GSPC': 'gspc', '^IXIC': 'ixic', '^RUT': 'rut', '^SOX': 'sox',
  '^VIX': 'vix', 'CL=F': 'wti', 'GC=F': 'gold', 'DX-Y.NYB': 'dxy',
  '^IRX': 'us2y', '^TNX': 'us10y', 'KRW=X': 'usdkrw',
};

async function yahooQuotes() {
  const encoded = YAHOO_SYMBOLS.map(s => encodeURIComponent(s)).join(',');
  const res = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encoded}`, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  const json = await res.json();
  const results: any[] = json?.quoteResponse?.result ?? [];
  const out: Record<string, any> = {};
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

async function fredSeries(seriesId: string, id: string, apiKey: string) {
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&limit=5&sort_order=desc&file_type=json`;
  const res = await fetch(url);
  const json = await res.json();
  const obs: { date: string; value: string }[] = json?.observations ?? [];
  const valid = obs.filter((o: any) => o.value !== '.' && !isNaN(parseFloat(o.value)));
  if (valid.length < 2) return null;
  const current = parseFloat(valid[0].value);
  const prev = parseFloat(valid[1].value);
  return { id, value: current, change: current - prev, changePercent: prev !== 0 ? ((current - prev) / prev) * 100 : 0, updatedAt: new Date(valid[0].date).toISOString() };
}

async function fearGreed() {
  const res = await fetch('https://production.dataviz.cnn.io/index/fearandgreed/graphdata', {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  const json = await res.json();
  const fg = json?.fear_and_greed;
  if (!fg) return null;
  return { score: Math.round(fg.score ?? 0), rating: fg.rating ?? '', previousClose: fg.previous_close ?? fg.score };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });

  try {
    const fredApiKey = Deno.env.get('FRED_API_KEY') ?? '';
    const [quotes, fg, tips, hySpread] = await Promise.allSettled([
      yahooQuotes(),
      fearGreed(),
      fredApiKey ? fredSeries('DFII10', 'tips10y', fredApiKey) : Promise.resolve(null),
      fredApiKey ? fredSeries('BAMLH0A0HYM2', 'hy_spread', fredApiKey) : Promise.resolve(null),
    ]);

    const fredData: Record<string, any> = {};
    if (tips.status === 'fulfilled' && tips.value) fredData['tips10y'] = tips.value;
    if (hySpread.status === 'fulfilled' && hySpread.value) fredData['hy_spread'] = hySpread.value;

    const body = JSON.stringify({
      quotes: quotes.status === 'fulfilled' ? quotes.value : {},
      fearGreed: fg.status === 'fulfilled' ? fg.value : null,
      fredData,
      fetchedAt: new Date().toISOString(),
    });

    return new Response(body, {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=900' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});
