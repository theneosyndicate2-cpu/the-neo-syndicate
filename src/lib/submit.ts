import type { SubmissionResult } from "@/lib/types";

/** Client helper for POSTing JSON forms to our API routes. */
export async function postJSON(url: string, body: unknown): Promise<SubmissionResult> {
  return requestJSON<SubmissionResult>(url, "POST", body);
}

export interface ApiResult {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
  code?: string;
  redirect?: string;
}

/** JSON request that never throws: network failures resolve to `{ ok: false, message }`. */
export async function requestJSON<T extends { ok: boolean; message?: string } = ApiResult & Record<string, unknown>>(
  url: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" = "POST",
  body?: unknown,
): Promise<T> {
  try {
    const res = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "same-origin",
    });
    const data = (await res.json().catch(() => null)) as T | null;
    return data ?? ({ ok: false, message: "Unexpected response. Please try again." } as T);
  } catch {
    return { ok: false, message: "Network error. Please check your connection and try again." } as T;
  }
}

export interface MeResponse {
  user: { name: string; email: string; telegram: string | null; tier: string } | null;
}

export async function fetchMe(): Promise<MeResponse["user"]> {
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store", credentials: "same-origin" });
    return ((await res.json()) as MeResponse).user;
  } catch {
    return null;
  }
}
