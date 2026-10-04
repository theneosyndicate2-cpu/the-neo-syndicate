import { NextResponse } from "next/server";
import { getMarketSnapshot } from "@/services/marketData";

export const dynamic = "force-dynamic";

/** Polled by the browser for live prices. `source` / `marketStatus` tell callers how fresh data is. */
export async function GET() {
  const snapshot = await getMarketSnapshot({ fresh: true });
  return NextResponse.json(snapshot, {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=3, stale-while-revalidate=10" },
  });
}
