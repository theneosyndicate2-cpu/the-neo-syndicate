import { NextResponse } from "next/server";
import { submitApplication } from "@/services/submissions";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }
  try {
    const result = await submitApplication((body ?? {}) as Record<string, never>);
    const status = result.ok ? 201 : result.code === "EMAIL_NOT_VERIFIED" ? 403 : 422;
    return NextResponse.json(result, { status });
  } catch (error) {
    console.error("[api/applications]", error);
    return NextResponse.json(
      { ok: false, message: "We couldn't submit your application right now. Please try again shortly." },
      { status: 502 },
    );
  }
}
