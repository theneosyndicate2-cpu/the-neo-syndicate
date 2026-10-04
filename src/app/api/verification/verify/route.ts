import { NextResponse } from "next/server";
import { confirmVerification } from "@/services/verification";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { token?: unknown; code?: unknown } | null;
  const result = confirmVerification(body?.token, body?.code);
  if (!result.ok) {
    return NextResponse.json(result, { status: result.status });
  }
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
