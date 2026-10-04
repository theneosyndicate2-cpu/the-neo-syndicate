import { clientIp, forbidden, json, readJson, sameOrigin } from "@/lib/server/http";
import { validateSignup, type SignupPayload } from "@/lib/validation";
import { findUserByEmail } from "@/services/users";
import { startVerification } from "@/services/verification";

/** Step 1 of sign-up: validate details and email a verification code. */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return forbidden();
  const { data, errors } = validateSignup(await readJson<SignupPayload>(request));
  if (!data) return json({ ok: false, errors, message: "Please review the highlighted fields." }, 422);

  if (await findUserByEmail(data.email)) {
    return json(
      { ok: false, errors: { email: "An account already exists for this email. Sign in instead." }, code: "EMAIL_TAKEN" },
      409,
    );
  }

  const result = await startVerification(data.email, clientIp(request));
  if (!result.ok) return json({ ok: false, message: result.message, retryAfter: result.retryAfter }, result.status);
  return json(result);
}
