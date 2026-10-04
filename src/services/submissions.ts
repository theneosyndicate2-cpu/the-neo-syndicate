import "server-only";
import { randomBytes } from "node:crypto";
import { getDb, schema } from "@/db";
import type { SessionUser } from "@/lib/server/auth";
import type { ApplicationPayload, ContactPayload, SubmissionResult } from "@/lib/types";
import { validateApplication, validateContact } from "@/lib/validation";
import { findUserByEmail } from "./users";
import { checkProof } from "./verification";

/**
 * Submission service for investment applications and contact messages.
 *
 * Applications are stored in the database (and appear in the member portal).
 * Both kinds are additionally forwarded to APPLICATIONS_WEBHOOK_URL when set
 * (CRM, Zapier, Make, Slack…). No payments are processed.
 */

function makeReference(prefix: string) {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${stamp}-${rand}`;
}

async function forward(kind: "application" | "contact", reference: string, data: unknown) {
  const webhook = process.env.APPLICATIONS_WEBHOOK_URL;
  if (!webhook) {
    console.info(`[submissions] ${kind} received (no webhook configured)`, reference);
    return;
  }
  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, reference, submittedAt: new Date().toISOString(), data }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

export async function submitApplication(
  input: Partial<ApplicationPayload> & { emailProof?: unknown },
  sessionUser: SessionUser | null,
): Promise<SubmissionResult> {
  const { data, errors } = validateApplication(input);
  if (!data) return { ok: false, errors, message: "Please review the highlighted fields." };

  // Email ownership: either a signed-in member applying with their account email,
  // or a fresh verification proof for this exact address.
  const viaAccount = !!sessionUser && sessionUser.email === data.email;
  if (!viaAccount && !checkProof(input.emailProof, data.email)) {
    return {
      ok: false,
      code: "EMAIL_NOT_VERIFIED",
      errors: { email: "Please verify your email address." },
      message: "Please verify your email address to submit your application.",
    };
  }

  const reference = makeReference("NSA");
  const owner = viaAccount ? sessionUser : await findUserByEmail(data.email);
  const db = await getDb();
  await db.insert(schema.applications).values({
    reference,
    userId: owner?.id ?? null,
    email: data.email,
    fullName: data.fullName,
    telegram: data.telegram || null,
    country: data.country,
    amount: data.amount,
    pool: data.pool,
    message: data.message || null,
    emailVerified: true,
  });

  try {
    await forward("application", reference, { ...data, emailVerified: true });
  } catch (error) {
    // Stored safely in the database; a webhook outage shouldn't fail the applicant.
    console.error("[submissions] webhook forward failed:", error);
  }
  return { ok: true, reference };
}

export async function submitContact(input: Partial<ContactPayload>): Promise<SubmissionResult> {
  const { data, errors } = validateContact(input);
  if (!data) return { ok: false, errors, message: "Please review the highlighted fields." };
  const reference = makeReference("NSC");
  await forward("contact", reference, data);
  return { ok: true, reference };
}
