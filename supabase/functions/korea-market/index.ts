// Supabase Edge Function (Deno) — Korean market data proxy

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const YAHOO_KOREA = ['^KS11', '^KQ11'];
const SYMBOL_TO_ID: Record<string, string> = { '^KS11': 'kospi', '^KQ11': 'kosdaq' };

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

async function getYahooCrumb(): Promise<{ crumb: string; cookie: string }> {
  const cookieRes = await fetch('https://fc.yahoo.com', {
    headers: { 'User-Agent': UA },
    redirect: 'follow',
  });
  const cookie = cookieRes.headers.get('set-cookie') ?? '';

  const crumbRes = await fetch('https://query2.finance.yahoo.com/v1/test/getcrumb', {
    headers: { 'User-Agent': UA, Cookie: cookie },
  });
  const crumb = await crumbRes.text();
  return { crumb, cookie };
}

async function yahooQuotes() {
  const { crumb, cookie } = await getYahooCrumb();
  const encoded = YAHOO_KOREA.map(s => encodeURIComponent(s)).join(',');
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encoded}&crumb=${encodeURIComponent(crumb)}`;

  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Cookie: cookie, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Yahoo ${res.status}`);

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
    headers: { 'User-Agent': UA },
  });
  if (!res.ok) return { advance: 0, decline: 0, unchanged: 0 };
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
      investorData: {},
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
