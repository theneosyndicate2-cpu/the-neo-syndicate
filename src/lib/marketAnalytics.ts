import type { Bias, MarketQuote, RawQuote, Sentiment, Trend } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

/**
 * Pure, deterministic analytics derived from price action.
 * Shared by the server (initial render) and the browser (live updates) so
 * both always agree. These are mechanical readings, not trade advice.
 */

const pct = (a: number, b: number) => (b ? ((a - b) / b) * 100 : 0);

export function computeSentiment(raws: RawQuote[]): Sentiment {
  const by = Object.fromEntries(raws.map((r) => [r.symbol, pct(r.price, r.previousClose)]));
  const btc = by.BTCUSD ?? 0;
  const dxy = by.DXY ?? 0;
  const gold = by.XAUUSD ?? 0;
  // Crypto bid + softer dollar => risk appetite; gold bid + crypto offered => defensive.
  if (btc > 0.5 && dxy <= 0) return "risk-on";
  if (gold > 0.3 && btc < 0) return "risk-off";
  if (btc < -1 && dxy > 0) return "risk-off";
  return "mixed";
}

export function enrichQuote(raw: RawQuote, sentiment: Sentiment): MarketQuote {
  const price = raw.price;
  const dayHigh = Math.max(raw.dayHigh, price);
  const dayLow = Math.min(raw.dayLow, price);
  const change = price - raw.previousClose;
  const changePercent = pct(price, raw.previousClose);
  const range = dayHigh - dayLow;
  const rangePos = range > 0 ? (price - dayLow) / range : 0.5;

  // Intraday floor pivots from the current session range.
  const pivot = (dayHigh + dayLow + price) / 3;
  const r1 = 2 * pivot - dayLow;
  const s1 = 2 * pivot - dayHigh;

  const trend: Trend =
    changePercent > 0.3 && rangePos > 0.5 ? "bullish" : changePercent < -0.3 && rangePos < 0.5 ? "bearish" : "neutral";
  const pivotGap = pct(price, pivot);
  const technicalBias: Bias = pivotGap > 0.05 ? "long" : pivotGap < -0.05 ? "short" : "neutral";

  const d = raw.decimals;
  const where = rangePos > 0.66 ? "upper third" : rangePos < 0.33 ? "lower third" : "middle";
  const commentary =
    raw.source === "demo"
      ? "Demo commentary — connect a market data source to generate notes from live price action."
      : `${raw.marketStatus === "closed" ? "Market closed — figures reflect the last session. " : ""}Trading ${formatNumber(
          Math.abs(changePercent),
          2,
        )}% ${change >= 0 ? "above" : "below"} the reference close, in the ${where} of the session range (${formatNumber(
          dayLow,
          d,
        )}–${formatNumber(dayHigh, d)}). Price is ${price >= pivot ? "above" : "below"} the calculated pivot at ${formatNumber(
          pivot,
          d,
        )}.`;

  return {
    ...raw,
    dayHigh,
    dayLow,
    change,
    changePercent,
    trend,
    sentiment,
    technicalBias,
    commentary,
    keyLevels: [
      { label: "R1 (calc.)", value: r1 },
      { label: "Pivot (calc.)", value: pivot },
      { label: "S1 (calc.)", value: s1 },
    ],
  };
}

export function enrichAll(raws: RawQuote[]): MarketQuote[] {
  const sentiment = computeSentiment(raws);
  return raws.map((r) => enrichQuote(r, sentiment));
}

/** Reduce a long series to at most `max` evenly spaced points (keeps the last point). */
export function downsample(series: number[], max = 48): number[] {
  const clean = series.filter((v) => Number.isFinite(v));
  if (clean.length <= max) return clean;
  const step = (clean.length - 1) / (max - 1);
  return Array.from({ length: max }, (_, i) => clean[Math.round(i * step)]);
}
