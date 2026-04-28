// Supabase Edge Function (Deno) — Korean market data proxy
// Deploy: supabase functions deploy korea-market

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const YAHOO_KOREA = ['^KS11', '^KQ11'];
const SYMBOL_TO_ID: Record<string, string> = { '^KS11': 'kospi', '^KQ11': 'kosdaq' };

async function yahooQuotes() {
  const encoded = YAHOO_KOREA.map(s => encodeURIComponent(s)).join(',');
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

async function naverAdvDec(market: string) {
  const res = await fetch(`https://m.stock.naver.com/api/index/${market}/basic`, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  const json = await res.json();
  return { advance: json?.riseCount ?? 0, decline: json?.fallCount ?? 0, unchanged: json?.unchangeCount ?? 0 };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });

  try {
    const [quotes, kospiAdv, kosdaqAdv] = await Promise.allSettled([
      yahooQuotes(),
      naverAdvDec('KOSPI'),
      naverAdvDec('KOSDAQ'),
    ]);

    const advanceDecline: Record<string, any> = {};
    if (kospiAdv.status === 'fulfilled') advanceDecline['kospi_adv'] = kospiAdv.value;
    if (kosdaqAdv.status === 'fulfilled') advanceDecline['kosdaq_adv'] = kosdaqAdv.value;

    const body = JSON.stringify({
      quotes: quotes.status === 'fulfilled' ? quotes.value : {},
      advanceDecline,
      investorData: {}, // T+1 data requires KOFIA integration; reserved for future
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
