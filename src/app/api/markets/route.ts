import { NextResponse } from "next/server";
import { getMarketSnapshot } from "@/services/marketData";

/** Public JSON endpoint for client-side refreshes. `source` tells callers whether data is live. */
export async function GET() {
  const snapshot = await getMarketSnapshot();
  return NextResponse.json(snapshot, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
  });
}
