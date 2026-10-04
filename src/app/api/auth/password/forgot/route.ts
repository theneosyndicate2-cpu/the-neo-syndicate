import { clientIp, forbidden, json, readJson, sameOrigin } from "@/lib/server/http";
import { findUserByEmail, normalizeEmail } from "@/services/users";
import { decoyChallenge, startVerification } from "@/services/verification";

/**
 * Password reset, step 1. Always answers the same way whether or not the email
 * has an account (no account enumeration); only real accounts receive a code.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return forbidden();
  const body = await readJson<{ email: string }>(request);
  const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return json({ ok: false, message: "Please enter a valid email address." }, 422);
  }

  if (!(await findUserByEmail(email))) return json(decoyChallenge(email));

  const result = await startVerification(email, clientIp(request));
  if (!result.ok) return json({ ok: false, message: result.message, retryAfter: result.retryAfter }, result.status);
  return json(result);
}
