import "server-only";
import { demoMarkets } from "@/data/markets";
import { downsample, enrichAll } from "@/lib/marketAnalytics";
import type { AssetSymbol, DataSource, MarketQuote, MarketSnapshot, RawQuote } from "@/lib/types";

/**
 * Market-data service.
 *
 * Default ("free" provider, no API keys):
 *   XAUUSD  spot price  → Swissquote public quote feed (bid/ask mid)
 *           daily range → COMEX gold futures (Yahoo chart API), scaled to spot
 *   DXY     price       → computed live from 6 spot FX pairs (Swissquote) with the ICE formula
 *           daily range → ICE DXY (Yahoo chart API), scaled to the computed value
 *   BTCUSD  price/range → Coinbase Exchange public API (24h open/high/low)
 *
 * Other options:
 *   MARKET_DATA_PROVIDER=demo        force demo data
 *   MARKET_DATA_API_URL (+ _API_KEY) your own endpoint returning `{ quotes: RawQuote[] }`
 *
 * Any asset whose provider fails falls back to clearly-labelled demo data.
 * NOTE: free public feeds are fine for an informational site; for a commercial
 * product, license data from a vendor (Twelve Data, Polygon, OANDA, ICE…) and
 * plug it in via MARKET_DATA_API_URL or a new adapter below.
 */

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; NeoSyndicateBot/1.0; +https://www.theneosyndicate.com)",
  Accept: "application/json",
};
const STALE_AFTER_MS = 10 * 60 * 1000; // quote older than this ⇒ market treated as closed

type FetchMode = { fresh: boolean };

/* ---------- tiny in-memory cache (per server instance) ---------- */
const memo = new Map<string, { expires: number; value: Promise<unknown> }>();
function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = memo.get(key);
  if (hit && hit.expires > Date.now()) return hit.value as Promise<T>;
  const value = fn().catch((err) => {
    memo.delete(key);
    throw err;
  });
  memo.set(key, { expires: Date.now() + ttlMs, value });
  return value;
}

// `next build` renders many pages in parallel workers; give providers more headroom there.
const TIMEOUT_MS = process.env.NEXT_PHASE === "phase-production-build" ? 25_000 : 6000;

async function getJSON<T>(url: string, { fresh }: FetchMode, revalidate = 15, attempts = 3): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, {
        headers: HEADERS,
        signal: AbortSignal.timeout(TIMEOUT_MS),
        ...(fresh ? { cache: "no-store" as const } : { next: { revalidate } }),
      });
      if (!res.ok) throw new Error(`${url} responded ${res.status}`);
      return (await res.json()) as T;
    } catch (error) {
      // Retry transient network failures (connect timeouts, resets) with a short backoff.
      if (attempt >= attempts) throw error;
      await new Promise((r) => setTimeout(r, 300 * attempt));
    }
  }
}

/* ---------- providers ---------- */

interface SwissquoteQuote {
  ts: number;
  spreadProfilePrices: { bid: number; ask: number }[];
}

async function swissquote(pair: string, mode: FetchMode) {
  return cached(`sq:${pair}:${mode.fresh}`, 3000, async () => {
    const data = await getJSON<SwissquoteQuote[]>(
      `https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/${pair}`,
      mode,
    );
    const latest = [...data].sort((a, b) => b.ts - a.ts)[0];
    const p = latest?.spreadProfilePrices?.[0];
    if (!p) throw new Error(`No Swissquote price for ${pair}`);
    return { mid: (p.bid + p.ask) / 2, ts: latest.ts };
  });
}

interface YahooChart {
  chart: {
    result: {
      meta: { regularMarketPrice: number; chartPreviousClose: number; regularMarketDayHigh: number; regularMarketDayLow: number };
      indicators: { quote: { close: (number | null)[] }[] };
    }[];
  };
}

/** Session reference data (prior close, range, intraday series). Optional — failures are tolerated. */
async function yahooSession(symbol: string) {
  return cached(`yh:${symbol}`, 60_000, async () => {
    const data = await getJSON<YahooChart>(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=5m`,
      { fresh: false },
      60,
    );
    const r = data.chart.result[0];
    return {
      price: r.meta.regularMarketPrice,
      previousClose: r.meta.chartPreviousClose,
      high: r.meta.regularMarketDayHigh,
      low: r.meta.regularMarketDayLow,
      closes: (r.indicators.quote[0]?.close ?? []).filter((v): v is number => typeof v === "number"),
    };
  }).catch((err) => {
    console.warn(`[marketData] session data unavailable for ${symbol}:`, (err as Error).message);
    return null;
  });
}

/** Builds a quote from a live price plus (optional) reference session data scaled to that price. */
function withSession(
  base: Omit<RawQuote, "previousClose" | "dayHigh" | "dayLow" | "history">,
  session: Awaited<ReturnType<typeof yahooSession>>,
): RawQuote {
  if (!session || !session.price) {
    return { ...base, previousClose: base.price, dayHigh: base.price, dayLow: base.price, history: [base.price] };
  }
  const k = base.price / session.price; // basis between live spot and the reference instrument
  return {
    ...base,
    previousClose: session.previousClose * k,
    dayHigh: session.high * k,
    dayLow: session.low * k,
    history: downsample([...session.closes.map((c) => c * k), base.price]),
  };
}

async function goldQuote(mode: FetchMode): Promise<RawQuote> {
  const [spot, session] = await Promise.all([swissquote("XAU/USD", mode), yahooSession("GC=F")]);
  return withSession(
    {
      symbol: "XAUUSD",
      name: "Gold Spot",
      description: "Gold vs US Dollar",
      price: spot.mid,
      decimals: 2,
      updatedAt: new Date(spot.ts).toISOString(),
      marketStatus: Date.now() - spot.ts > STALE_AFTER_MS ? "closed" : "open",
      source: "live",
      sourceName: "Swissquote spot · COMEX session range",
    },
    session,
  );
}

const DXY_WEIGHTS: [pair: string, exponent: number][] = [
  ["EUR/USD", -0.576],
  ["USD/JPY", 0.136],
  ["GBP/USD", -0.119],
  ["USD/CAD", 0.091],
  ["USD/SEK", 0.042],
  ["USD/CHF", 0.036],
];

async function dxyQuote(mode: FetchMode): Promise<RawQuote> {
  const [legs, session] = await Promise.all([
    Promise.all(DXY_WEIGHTS.map(([pair]) => swissquote(pair, mode))),
    yahooSession("DX-Y.NYB"),
  ]);
  const value = legs.reduce((acc, leg, i) => acc * Math.pow(leg.mid, DXY_WEIGHTS[i][1]), 50.14348112);
  const ts = Math.max(...legs.map((l) => l.ts));
  return withSession(
    {
      symbol: "DXY",
      name: "US Dollar Index",
      description: "USD vs basket of majors",
      price: value,
      decimals: 3,
      updatedAt: new Date(ts).toISOString(),
      marketStatus: Date.now() - ts > STALE_AFTER_MS ? "closed" : "open",
      source: "live",
      sourceName: "Computed from spot FX (ICE formula) · ICE session range",
    },
    session,
  );
}

async function btcQuote(mode: FetchMode): Promise<RawQuote> {
  const base = "https://api.exchange.coinbase.com/products/BTC-USD";
  const [ticker, stats, candles] = await Promise.all([
    cached(`cb:ticker:${mode.fresh}`, 2000, () => getJSON<{ price: string; time: string }>(`${base}/ticker`, mode)),
    cached(`cb:stats`, 15_000, () => getJSON<{ open: string; high: string; low: string }>(`${base}/stats`, mode)),
    cached(`cb:candles`, 120_000, () =>
      getJSON<[number, number, number, number, number, number][]>(`${base}/candles?granularity=900`, { fresh: false }, 120),
    ).catch(() => []),
  ]);
  const price = Number(ticker.price);
  // Coinbase candles: [time, low, high, open, close, volume], newest first. Last 24h = 96 x 15m.
  const closes = candles.slice(0, 96).reverse().map((c) => c[4]);
  return {
    symbol: "BTCUSD",
    name: "Bitcoin",
    description: "Bitcoin vs US Dollar",
    price,
    previousClose: Number(stats.open),
    dayHigh: Number(stats.high),
    dayLow: Number(stats.low),
    decimals: 0,
    history: downsample([...closes, price]),
    updatedAt: ticker.time ?? new Date().toISOString(),
    marketStatus: "open",
    source: "live",
    sourceName: "Coinbase · 24h rolling",
  };
}

/* ---------- public API ---------- */

const ORDER: AssetSymbol[] = ["XAUUSD", "BTCUSD", "DXY"];
const demoFor = (symbol: AssetSymbol) => demoMarkets.find((q) => q.symbol === symbol)!;

function toSnapshot(raws: RawQuote[]): MarketSnapshot {
  const sources = new Set(raws.map((r) => r.source));
  const source: DataSource = sources.size === 1 ? [...sources][0] : "delayed";
  return { source, quotes: enrichAll(raws), fetchedAt: new Date().toISOString() };
}

async function fromCustomEndpoint(url: string): Promise<MarketSnapshot> {
  const res = await fetch(url, {
    headers: process.env.MARKET_DATA_API_KEY ? { Authorization: `Bearer ${process.env.MARKET_DATA_API_KEY}` } : undefined,
    next: { revalidate: 15, tags: ["markets"] },
  });
  if (!res.ok) throw new Error(`Market data provider responded ${res.status}`);
  const body = (await res.json()) as { quotes: RawQuote[] };
  return toSnapshot(body.quotes.map((q) => ({ ...q, source: q.source ?? "live" })));
}

/**
 * @param fresh  true for the polling API route (bypasses Next's data cache, uses a
 *               short in-memory cache); false for page renders (ISR-friendly).
 */
export async function getMarketSnapshot({ fresh = false }: { fresh?: boolean } = {}): Promise<MarketSnapshot> {
  if (process.env.MARKET_DATA_PROVIDER === "demo") return toSnapshot(demoMarkets);

  const custom = process.env.MARKET_DATA_API_URL;
  if (custom) {
    try {
      return await fromCustomEndpoint(custom);
    } catch (error) {
      console.error("[marketData] custom provider failed, using built-in feeds:", error);
    }
  }

  const mode = { fresh };
  const loaders: Record<AssetSymbol, () => Promise<RawQuote>> = {
    XAUUSD: () => goldQuote(mode),
    BTCUSD: () => btcQuote(mode),
    DXY: () => dxyQuote(mode),
  };
  const results = await Promise.allSettled(ORDER.map((s) => loaders[s]()));
  const raws = results.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    console.error(`[marketData] ${ORDER[i]} unavailable, using demo data:`, (r.reason as Error)?.message);
    return demoFor(ORDER[i]);
  });
  return toSnapshot(raws);
}

export async function getMarketQuote(symbol: AssetSymbol): Promise<{ source: DataSource; quote?: MarketQuote }> {
  const snapshot = await getMarketSnapshot();
  const quote = snapshot.quotes.find((q) => q.symbol === symbol);
  return { source: quote?.source ?? snapshot.source, quote };
}
