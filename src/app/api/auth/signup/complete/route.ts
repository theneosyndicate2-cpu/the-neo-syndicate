import { createSession } from "@/lib/server/auth";
import { forbidden, json, readJson, sameOrigin } from "@/lib/server/http";
import { validateSignup, type SignupPayload } from "@/lib/validation";
import { createUser } from "@/services/users";
import { confirmVerification } from "@/services/verification";

/** Step 2 of sign-up: confirm the emailed code, create the account and sign in. */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return forbidden();
  const body = await readJson<SignupPayload & { token: string; code: string }>(request);
  const { data, errors } = validateSignup(body);
  if (!data) return json({ ok: false, errors, message: "Please review your details." }, 422);

  const verified = confirmVerification(body.token, body.code, data.email);
  if (!verified.ok) return json(verified, verified.status);

  const user = await createUser(data);
  if (!user) {
    return json({ ok: false, code: "EMAIL_TAKEN", message: "An account already exists for this email. Sign in instead." }, 409);
  }
  await createSession(user.id);
  return json({ ok: true, redirect: "/portal" }, 201);
}
