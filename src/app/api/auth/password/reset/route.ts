import { clearLoginFailures, createSession, destroyAllSessions } from "@/lib/server/auth";
import { forbidden, json, readJson, sameOrigin } from "@/lib/server/http";
import { passwordProblem } from "@/lib/validation";
import { findUserByEmail, normalizeEmail, setPassword } from "@/services/users";
import { confirmVerification } from "@/services/verification";

/** Password reset, step 2: confirm the emailed code and set a new password. Signs out all other devices. */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return forbidden();
  const body = await readJson<{ email: string; token: string; code: string; password: string }>(request);
  const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
  const password = typeof body.password === "string" ? body.password : "";

  const problem = passwordProblem(password, email);
  if (problem) return json({ ok: false, errors: { password: problem }, message: problem }, 422);

  const verified = confirmVerification(body.token, body.code, email);
  if (!verified.ok) return json(verified, verified.status);

  const user = await findUserByEmail(email);
  if (!user) return json({ ok: false, message: "This reset link is no longer valid. Please start again.", expired: true }, 422);

  await setPassword(user.id, password);
  clearLoginFailures(`email:${email}`); // proven ownership — lift any sign-in lockout
  await destroyAllSessions(user.id);
  await createSession(user.id);
  return json({ ok: true, redirect: "/portal" });
}
