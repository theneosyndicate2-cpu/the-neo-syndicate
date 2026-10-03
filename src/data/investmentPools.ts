import type { InvestmentPool } from "@/lib/types";

/**
 * PLACEHOLDER investment pools.
 * Terms, minimums and availability are illustrative until confirmed and
 * connected to a backend. No returns are implied or guaranteed.
 */
export const investmentPools: InvestmentPool[] = [
  {
    id: "weekend-48h",
    name: "48-Hour Pool",
    tagline: "Short-duration participation",
    minimum: 300,
    currency: "GBP",
    duration: "48 Hours",
    status: "OPEN",
    riskLevel: "High",
    strategy:
      "A short-duration allocation focused on intraday XAUUSD execution with predefined risk per trade and a hard drawdown limit for the cycle.",
    markets: ["XAUUSD"],
    highlights: ["Defined cycle window", "Predefined risk per trade", "Cycle summary report"],
  },
  {
    id: "weekly",
    name: "Weekly Pool",
    tagline: "Selected opportunities",
    minimum: 1000,
    currency: "GBP",
    duration: "7 Days",
    status: "FILLING",
    riskLevel: "High",
    strategy:
      "Selected swing opportunities across XAUUSD and BTCUSD for qualified participants, with position sizing set by the desk's weekly risk budget.",
    markets: ["XAUUSD", "BTCUSD"],
    highlights: ["Qualified participants", "Weekly risk budget", "Mid-week update"],
  },
  {
    id: "custom-capital",
    name: "Custom Capital",
    tagline: "Private allocations",
    minimum: 10000,
    currency: "GBP",
    duration: "Agreed privately",
    status: "BY APPLICATION",
    riskLevel: "Very High",
    strategy:
      "Larger allocations handled privately, with mandate, risk parameters and reporting cadence agreed individually before any participation.",
    markets: ["XAUUSD", "BTCUSD", "Selected markets"],
    highlights: ["Private onboarding", "Bespoke risk parameters", "Direct desk contact"],
  },
];
