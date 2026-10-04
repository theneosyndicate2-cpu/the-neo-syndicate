import {
  clearLoginFailures,
  createSession,
  loginBlocked,
  recordLoginFailure,
  timingSafeDummy,
  verifyPassword,
} from "@/lib/server/auth";
import { clientIp, forbidden, json, readJson, sameOrigin } from "@/lib/server/http";
import { findUserByEmail, normalizeEmail } from "@/services/users";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return forbidden();
  const body = await readJson<{ email: string; password: string }>(request);
  const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) return json({ ok: false, message: "Enter your email and password." }, 422);

  const keys = [`ip:${clientIp(request)}`, `email:${email}`];
  const wait = Math.max(...keys.map(loginBlocked));
  if (wait) {
    return json({ ok: false, message: `Too many attempts. Try again in ${Math.ceil(wait / 60)} min.` }, 429, {
      "Retry-After": String(wait),
    });
  }

  const user = await findUserByEmail(email);
  const valid = user ? await verifyPassword(password, user.passwordHash) : await timingSafeDummy(password);
  if (!user || !valid) {
    keys.forEach(recordLoginFailure);
    return json({ ok: false, message: "Incorrect email or password." }, 401);
  }

  keys.forEach(clearLoginFailures);
  await createSession(user.id);
  return json({ ok: true });
}
