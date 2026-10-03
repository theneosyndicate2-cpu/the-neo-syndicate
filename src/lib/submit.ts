import type { SubmissionResult } from "@/lib/types";

/** Client helper for POSTing JSON forms to our API routes. */
export async function postJSON(url: string, body: unknown): Promise<SubmissionResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => null)) as SubmissionResult | null;
    if (data) return data;
    return { ok: false, message: "Unexpected response. Please try again." };
  } catch {
    return { ok: false, message: "Network error. Please check your connection and try again." };
  }
}
