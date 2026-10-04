import "server-only";
import { desc } from "drizzle-orm";
import { getDb, schema } from "@/db";
import type { TradeRow } from "@/db/schema";
import { demoTrades } from "@/data/trades";
import type { DataSource, Trade } from "@/lib/types";

/**
 * Trades service. Once the desk posts trades from the admin dashboard they
 * replace the sample data automatically (and are no longer labelled demo).
 */

export const toTrade = (r: TradeRow): Trade => ({
  id: r.code,
  asset: r.asset as Trade["asset"],
  direction: r.direction as Trade["direction"],
  entry: r.entry,
  stopLoss: r.stopLoss,
  takeProfits: r.takeProfits,
  result: r.result as Trade["result"],
  status: r.status as Trade["status"],
  rMultiple: r.rMultiple,
  date: r.openedAt.toISOString(),
  note: r.note ?? undefined,
});

export async function getTrades(): Promise<{ source: DataSource; trades: Trade[] }> {
  const db = await getDb();
  const rows = await db.select().from(schema.trades).orderBy(desc(schema.trades.openedAt));
  if (rows.length) return { source: "live", trades: rows.map(toTrade) };
  return { source: "demo", trades: [...demoTrades].sort((a, b) => b.date.localeCompare(a.date)) };
}

export async function getRecentTrades(limit = 3) {
  const { source, trades } = await getTrades();
  return { source, trades: trades.slice(0, limit) };
}
