import type { PerformanceSummary } from "@/lib/types";

/**
 * DEMO performance data — placeholder figures for layout purposes only.
 * This is NOT verified trading performance. Replace with audited/verified
 * figures via src/services/performance.ts before presenting as real.
 */
export const demoPerformance: PerformanceSummary = {
  source: "demo",
  asOf: "2026-09-30T00:00:00.000Z",
  stats: [
    {
      id: "win-rate",
      label: "Win rate",
      value: 64,
      suffix: "%",
      caption: "Closed trades, demo sample",
    },
    {
      id: "trades",
      label: "Trades executed",
      value: 1240,
      suffix: "+",
      caption: "Demo sample size",
    },
    {
      id: "markets",
      label: "Markets covered",
      value: 6,
      caption: "Gold, Bitcoin & selected FX",
    },
    {
      id: "avg-r",
      label: "Average R per trade",
      value: 0.9,
      decimals: 1,
      suffix: "R",
      caption: "Risk-adjusted, demo sample",
    },
  ],
  history: [
    { label: "Apr", value: 6.2 },
    { label: "May", value: -2.4 },
    { label: "Jun", value: 8.1 },
    { label: "Jul", value: 4.6 },
    { label: "Aug", value: -1.3 },
    { label: "Sep", value: 7.4 },
  ],
};
