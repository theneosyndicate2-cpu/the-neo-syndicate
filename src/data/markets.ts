import type { RawQuote } from "@/lib/types";

/**
 * DEMO market data — used only as a fallback when live providers are
 * unreachable (or when MARKET_DATA_PROVIDER=demo). Always labelled "Demo" in the UI.
 */
export const demoMarkets: RawQuote[] = [
  {
    symbol: "XAUUSD",
    name: "Gold Spot",
    description: "Gold vs US Dollar",
    price: 3412.6,
    previousClose: 3394.25,
    dayHigh: 3421.9,
    dayLow: 3388.15,
    decimals: 2,
    history: [42, 44, 43, 47, 46, 49, 52, 50, 53, 55, 54, 58, 57, 60, 62, 61, 64, 66],
    updatedAt: "2026-10-03T16:00:00.000Z",
    marketStatus: "open",
    source: "demo",
    sourceName: "Demo data",
  },
  {
    symbol: "BTCUSD",
    name: "Bitcoin",
    description: "Bitcoin vs US Dollar",
    price: 98450,
    previousClose: 99690,
    dayHigh: 100210,
    dayLow: 97680,
    decimals: 0,
    history: [60, 63, 61, 64, 62, 58, 59, 55, 57, 54, 56, 53, 55, 52, 54, 51, 50, 52],
    updatedAt: "2026-10-03T16:00:00.000Z",
    marketStatus: "open",
    source: "demo",
    sourceName: "Demo data",
  },
  {
    symbol: "DXY",
    name: "US Dollar Index",
    description: "USD vs basket of majors",
    price: 101.24,
    previousClose: 101.55,
    dayHigh: 101.62,
    dayLow: 101.08,
    decimals: 2,
    history: [64, 63, 64, 61, 62, 60, 58, 59, 57, 58, 55, 56, 54, 53, 54, 52, 51, 50],
    updatedAt: "2026-10-03T16:00:00.000Z",
    marketStatus: "open",
    source: "demo",
    sourceName: "Demo data",
  },
];
