import { createSession, destroyAllSessions, getCurrentUser, verifyPassword } from "@/lib/server/auth";
import { forbidden, json, readJson, sameOrigin } from "@/lib/server/http";
import { passwordProblem, validateProfile } from "@/lib/validation";
import { findUserByEmail, setPassword, updateProfile } from "@/services/users";

/**
 * Account management for the signed-in member.
 *   PATCH  { name, telegram }                     → update profile
 *   POST   { action: "password", current, next }  → change password (signs out other devices)
 *   DELETE                                        → sign out of all devices
 */

async function authed(request: Request) {
  if (!sameOrigin(request)) return { error: forbidden() };
  const user = await getCurrentUser();
  if (!user) return { error: json({ ok: false, message: "Please sign in again." }, 401) };
  return { user };
}

export async function PATCH(request: Request) {
  const { user, error } = await authed(request);
  if (error) return error;
  const { data, errors } = validateProfile(await readJson<{ name: string; telegram: string }>(request));
  if (!data) return json({ ok: false, errors, message: "Please review the highlighted fields." }, 422);
  await updateProfile(user.id, { name: data.name, telegram: data.telegram || null });
  return json({ ok: true });
}

export async function POST(request: Request) {
  const { user, error } = await authed(request);
  if (error) return error;
  const body = await readJson<{ action: string; current: string; next: string }>(request);
  if (body.action !== "password") return json({ ok: false, message: "Unknown action." }, 400);

  const record = await findUserByEmail(user.email);
  if (!record || typeof body.current !== "string" || !(await verifyPassword(body.current, record.passwordHash))) {
    return json({ ok: false, errors: { current: "Current password is incorrect." } }, 422);
  }
  const next = typeof body.next === "string" ? body.next : "";
  const problem = passwordProblem(next, user.email);
  if (problem) return json({ ok: false, errors: { next: problem } }, 422);

  await setPassword(user.id, next);
  await destroyAllSessions(user.id);
  await createSession(user.id);
  return json({ ok: true, message: "Password updated. Other devices have been signed out." });
}

export async function DELETE(request: Request) {
  const { user, error } = await authed(request);
  if (error) return error;
  await destroyAllSessions(user.id);
  await createSession(user.id);
  return json({ ok: true, message: "Signed out of all other devices." });
}
