import "server-only";
import { verificationEmail } from "@/emails/verificationEmail";
import { hmac, randomCode, randomId, safeEqual, sign, verify } from "@/lib/server/tokens";
import { deliveryMode, sendEmail } from "./email";

/**
 * Email verification by 6-digit code.
 *
 *  1. startVerification(email)   → emails a code, returns a signed `challenge` token
 *  2. confirmVerification(token, code) → returns a signed `proof` token
 *  3. checkProof(proof, email)    → used by the application endpoint
 *
 * The code itself is never stored or returned — the challenge only carries
 * an HMAC of it. Attempt counters and send throttles are in-memory (per
 * server instance); swap `limits` for Redis/a database when scaling out.
 */

const CODE_TTL_MIN = 10;
const PROOF_TTL_MIN = 30;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_S = 60;
const MAX_SENDS_PER_HOUR = 5;

interface Challenge {
  t: "challenge";
  id: string;
  e: string; // email
  h: string; // hmac(code)
  x: number; // expiry (ms)
}

interface Proof {
  t: "proof";
  e: string;
  x: number;
}

/* ---------- in-memory limits ---------- */
const attempts = new Map<string, { count: number; expires: number }>();
const sends = new Map<string, number[]>(); // key → send timestamps

function prune() {
  const now = Date.now();
  for (const [k, v] of attempts) if (v.expires < now) attempts.delete(k);
  for (const [k, v] of sends) {
    const recent = v.filter((t) => now - t < 3_600_000);
    if (recent.length) sends.set(k, recent);
    else sends.delete(k);
  }
}

function checkSendLimit(key: string): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const history = (sends.get(key) ?? []).filter((t) => now - t < 3_600_000);
  const last = history[history.length - 1];
  if (last && now - last < RESEND_COOLDOWN_S * 1000) {
    return { ok: false, retryAfter: Math.ceil((RESEND_COOLDOWN_S * 1000 - (now - last)) / 1000) };
  }
  if (history.length >= MAX_SENDS_PER_HOUR) {
    return { ok: false, retryAfter: Math.ceil((3_600_000 - (now - history[0])) / 1000) };
  }
  return { ok: true };
}

const codeHash = (id: string, email: string, code: string) => hmac(`${id}:${email}:${code}`);

export type StartResult =
  | { ok: true; token: string; expiresAt: number; resendAfter: number; testCode?: string }
  | { ok: false; status: number; message: string; retryAfter?: number };

export async function startVerification(email: string, clientKey: string): Promise<StartResult> {
  prune();
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalized) || normalized.length > 200) {
    return { ok: false, status: 422, message: "Please enter a valid email address." };
  }

  for (const key of [`e:${normalized}`, `c:${clientKey}`]) {
    const limit = checkSendLimit(key);
    if (!limit.ok) {
      return {
        ok: false,
        status: 429,
        retryAfter: limit.retryAfter,
        message: `Please wait ${limit.retryAfter}s before requesting another code.`,
      };
    }
  }

  const mode = deliveryMode();
  if (mode === "unconfigured") {
    return { ok: false, status: 503, message: "Email verification is temporarily unavailable. Please contact the desk." };
  }

  const code = randomCode();
  const id = randomId();
  const expiresAt = Date.now() + CODE_TTL_MIN * 60_000;
  const token = sign<Challenge>({ t: "challenge", id, e: normalized, h: codeHash(id, normalized, code), x: expiresAt });

  const message = verificationEmail({ code, minutes: CODE_TTL_MIN });
  try {
    await sendEmail({ to: normalized, ...message });
  } catch (error) {
    console.error("[verification] email send failed:", error);
    return { ok: false, status: 502, message: "We couldn't send the code. Please check the address and try again." };
  }

  const now = Date.now();
  for (const key of [`e:${normalized}`, `c:${clientKey}`]) sends.set(key, [...(sends.get(key) ?? []), now]);

  return {
    ok: true,
    token,
    expiresAt,
    resendAfter: RESEND_COOLDOWN_S,
    // Test mode only (no email provider configured): expose the code so the flow can be exercised.
    ...(mode === "console" ? { testCode: code } : {}),
  };
}

export type ConfirmResult =
  | { ok: true; proof: string; email: string }
  | { ok: false; status: number; message: string; attemptsLeft?: number; expired?: boolean };

export function confirmVerification(token: unknown, code: unknown): ConfirmResult {
  prune();
  const challenge = verify<Challenge>(token);
  if (!challenge || challenge.t !== "challenge") {
    return { ok: false, status: 410, expired: true, message: "This code has expired. Please request a new one." };
  }
  const entry = attempts.get(challenge.id) ?? { count: 0, expires: challenge.x };
  if (entry.count >= MAX_ATTEMPTS) {
    return { ok: false, status: 429, expired: true, message: "Too many incorrect attempts. Please request a new code." };
  }

  const clean = typeof code === "string" ? code.replace(/\D/g, "") : "";
  if (clean.length !== 6 || !safeEqual(codeHash(challenge.id, challenge.e, clean), challenge.h)) {
    entry.count += 1;
    attempts.set(challenge.id, entry);
    const attemptsLeft = MAX_ATTEMPTS - entry.count;
    return {
      ok: false,
      status: 422,
      attemptsLeft,
      expired: attemptsLeft <= 0,
      message: attemptsLeft > 0 ? `Incorrect code. ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} left.` : "Too many incorrect attempts. Please request a new code.",
    };
  }

  // Burn the challenge so the same code can't be reused.
  attempts.set(challenge.id, { count: MAX_ATTEMPTS, expires: challenge.x });
  const proof = sign<Proof>({ t: "proof", e: challenge.e, x: Date.now() + PROOF_TTL_MIN * 60_000 });
  return { ok: true, proof, email: challenge.e };
}

/** True when `proof` is a valid, unexpired verification for `email`. */
export function checkProof(proof: unknown, email: string): boolean {
  const p = verify<Proof>(proof);
  return !!p && p.t === "proof" && p.e === email.trim().toLowerCase();
}
