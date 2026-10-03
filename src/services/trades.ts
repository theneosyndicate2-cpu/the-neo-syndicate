import "server-only";
import { demoTrades } from "@/data/trades";
import type { DataSource, Trade } from "@/lib/types";

/**
 * Trades service. Swap the body of `getTrades` for a database query or API
 * call (e.g. Prisma/Supabase/your admin backend). Keep the return shape.
 */
export async function getTrades(): Promise<{ source: DataSource; trades: Trade[] }> {
  const trades = [...demoTrades].sort((a, b) => b.date.localeCompare(a.date));
  return { source: "demo", trades };
}

export async function getRecentTrades(limit = 3) {
  const { source, trades } = await getTrades();
  return { source, trades: trades.slice(0, limit) };
}
