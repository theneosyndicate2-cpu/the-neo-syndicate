import "server-only";
import { NextResponse } from "next/server";

/** Small helpers shared by the JSON API routes. */

export const clientIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";

export async function readJson<T>(request: Request): Promise<Partial<T>> {
  const body = await request.json().catch(() => null);
  return body && typeof body === "object" ? (body as Partial<T>) : {};
}

export const json = (body: unknown, status = 200, headers?: HeadersInit) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

/** Reject cross-site form posts (defence in depth on top of SameSite cookies). */
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export const forbidden = () => json({ ok: false, message: "Request blocked." }, 403);
