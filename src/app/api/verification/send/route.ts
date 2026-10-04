import { NextResponse } from "next/server";
import { startVerification } from "@/services/verification";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email : "";
  const clientKey = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  const result = await startVerification(email, clientKey);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: result.message, retryAfter: result.retryAfter },
      { status: result.status, headers: result.retryAfter ? { "Retry-After": String(result.retryAfter) } : undefined },
    );
  }
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
