import { NextResponse } from "next/server";
import { submitContact } from "@/services/submissions";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }
  try {
    const result = await submitContact((body ?? {}) as Record<string, never>);
    return NextResponse.json(result, { status: result.ok ? 201 : 422 });
  } catch (error) {
    console.error("[api/contact]", error);
    return NextResponse.json(
      { ok: false, message: "We couldn't send your message right now. Please try again shortly." },
      { status: 502 },
    );
  }
}
