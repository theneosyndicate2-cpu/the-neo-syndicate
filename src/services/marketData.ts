import "server-only";
import { demoMarkets } from "@/data/markets";
import type { AssetSymbol, MarketQuote, MarketSnapshot } from "@/lib/types";

/**
 * Market-data service.
 *
 * Today: returns clearly-labelled DEMO data (source: "demo").
 * Later: set MARKET_DATA_API_URL (+ MARKET_DATA_API_KEY) to an endpoint that
 * returns `{ quotes: MarketQuote[] }` — or adapt `fetchFromProvider` to map any
 * vendor's response (e.g. Twelve Data, Polygon, OANDA) into `MarketQuote`.
 *
 * The UI only ever consumes `MarketSnapshot`, so swapping providers never
 * requires touching components. Any non-"live" source is labelled in the UI.
 */

const REVALIDATE_SECONDS = 60;

interface MarketDataProvider {
  getQuotes(): Promise<MarketSnapshot>;
}

const demoProvider: MarketDataProvider = {
  async getQuotes() {
    return { source: "demo", quotes: demoMarkets, fetchedAt: new Date().toISOString() };
  },
};

const httpProvider = (url: string, apiKey?: string): MarketDataProvider => ({
  async getQuotes() {
    const res = await fetch(url, {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
      next: { revalidate: REVALIDATE_SECONDS, tags: ["markets"] },
    });
    if (!res.ok) throw new Error(`Market data provider responded ${res.status}`);
    const body = (await res.json()) as { quotes: MarketQuote[]; delayed?: boolean };
    return {
      source: body.delayed ? "delayed" : "live",
      quotes: body.quotes,
      fetchedAt: new Date().toISOString(),
    };
  },
});

function resolveProvider(): MarketDataProvider {
  const url = process.env.MARKET_DATA_API_URL;
  return url ? httpProvider(url, process.env.MARKET_DATA_API_KEY) : demoProvider;
}

export async function getMarketSnapshot(): Promise<MarketSnapshot> {
  try {
    return await resolveProvider().getQuotes();
  } catch (error) {
    console.error("[marketData] falling back to demo data:", error);
    return demoProvider.getQuotes();
  }
}

export async function getMarketQuote(symbol: AssetSymbol) {
  const snapshot = await getMarketSnapshot();
  return { source: snapshot.source, quote: snapshot.quotes.find((q) => q.symbol === symbol) };
}
