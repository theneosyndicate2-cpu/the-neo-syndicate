import "server-only";
import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";

/**
 * Stateless signed tokens (HMAC-SHA256) used by the email-verification flow.
 * Format: base64url(JSON payload) + "." + base64url(signature)
 *
 * Set VERIFICATION_SECRET (32+ random chars) in production so tokens survive
 * restarts and work across multiple server instances.
 */

const SECRET = (() => {
  const configured = process.env.VERIFICATION_SECRET;
  if (configured && configured.length >= 32) return configured;
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
    console.warn("[tokens] VERIFICATION_SECRET is missing or too short — using an ephemeral secret.");
  }
  return randomBytes(32).toString("hex");
})();

const b64 = (buf: Buffer | string) => Buffer.from(buf).toString("base64url");

export function hmac(value: string) {
  return createHmac("sha256", SECRET).update(value).digest("base64url");
}

export function sign<T extends object>(payload: T): string {
  const body = b64(JSON.stringify(payload));
  return `${body}.${hmac(body)}`;
}

export function verify<T extends { x: number }>(token: unknown): T | null {
  if (typeof token !== "string" || token.length > 2048) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = Buffer.from(hmac(body));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T;
    return payload.x > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

export function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export const randomCode = () => String(randomInt(0, 1_000_000)).padStart(6, "0");
export const randomId = () => randomBytes(12).toString("base64url");
