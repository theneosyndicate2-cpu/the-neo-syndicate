import type { MarketQuote } from "@/lib/types";

/**
 * DEMO market data.
 * These are illustrative reference values only — they are NOT live prices.
 * Replace by configuring MARKET_DATA_API_URL (see src/services/marketData.ts).
 */
export const demoMarkets: MarketQuote[] = [
  {
    symbol: "XAUUSD",
    name: "Gold Spot",
    description: "Gold vs US Dollar",
    price: 3412.6,
    change: 18.35,
    changePercent: 0.54,
    dayHigh: 3421.9,
    dayLow: 3388.15,
    decimals: 2,
    trend: "bullish",
    sentiment: "risk-off",
    technicalBias: "long",
    commentary:
      "Holding above the prior session's value area. Dips into demand remain the preferred location; a loss of the daily pivot would neutralise the bias.",
    keyLevels: [
      { label: "Resistance", value: 3435.0 },
      { label: "Pivot", value: 3398.5 },
      { label: "Support", value: 3372.0 },
    ],
    history: [42, 44, 43, 47, 46, 49, 52, 50, 53, 55, 54, 58, 57, 60, 62, 61, 64, 66],
    updatedAt: "2026-10-03T16:00:00.000Z",
  },
  {
    symbol: "BTCUSD",
    name: "Bitcoin",
    description: "Bitcoin vs US Dollar",
    price: 98450,
    change: -1240,
    changePercent: -1.24,
    dayHigh: 100210,
    dayLow: 97680,
    decimals: 0,
    trend: "neutral",
    sentiment: "mixed",
    technicalBias: "neutral",
    commentary:
      "Rotating inside a well-defined range. Waiting for acceptance outside the range extremes before committing directional risk.",
    keyLevels: [
      { label: "Range high", value: 101500 },
      { label: "Mid-range", value: 98800 },
      { label: "Range low", value: 96200 },
    ],
    history: [60, 63, 61, 64, 62, 58, 59, 55, 57, 54, 56, 53, 55, 52, 54, 51, 50, 52],
    updatedAt: "2026-10-03T16:00:00.000Z",
  },
  {
    symbol: "DXY",
    name: "US Dollar Index",
    description: "USD vs basket of majors",
    price: 101.24,
    change: -0.31,
    changePercent: -0.31,
    dayHigh: 101.62,
    dayLow: 101.08,
    decimals: 2,
    trend: "bearish",
    sentiment: "risk-off",
    technicalBias: "short",
    commentary:
      "Lower highs on the daily chart. Continued dollar softness is supportive for gold; watching the next round of US data for confirmation.",
    keyLevels: [
      { label: "Resistance", value: 102.1 },
      { label: "Pivot", value: 101.5 },
      { label: "Support", value: 100.75 },
    ],
    history: [64, 63, 64, 61, 62, 60, 58, 59, 57, 58, 55, 56, 54, 53, 54, 52, 51, 50],
    updatedAt: "2026-10-03T16:00:00.000Z",
  },
];
