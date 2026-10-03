import "server-only";
import type { ApplicationPayload, ContactPayload, SubmissionResult } from "@/lib/types";
import { validateApplication, validateContact } from "@/lib/validation";

/**
 * Submission service for investment applications and contact messages.
 *
 * No payments are processed. Valid submissions are forwarded to
 * APPLICATIONS_WEBHOOK_URL when configured (CRM, Zapier, Make, Slack…),
 * otherwise logged on the server. Replace `persist` with a database insert
 * when the admin backend exists.
 */

function makeReference(prefix: string) {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${stamp}-${rand}`;
}

async function persist(kind: "application" | "contact", reference: string, data: unknown) {
  const record = { kind, reference, submittedAt: new Date().toISOString(), data };
  const webhook = process.env.APPLICATIONS_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } else {
    console.info(`[submissions] ${kind} received (no webhook configured)`, reference);
  }
}

export async function submitApplication(input: Partial<ApplicationPayload>): Promise<SubmissionResult> {
  const { data, errors } = validateApplication(input);
  if (!data) return { ok: false, errors, message: "Please review the highlighted fields." };
  const reference = makeReference("NSA");
  await persist("application", reference, data);
  return { ok: true, reference };
}

export async function submitContact(input: Partial<ContactPayload>): Promise<SubmissionResult> {
  const { data, errors } = validateContact(input);
  if (!data) return { ok: false, errors, message: "Please review the highlighted fields." };
  const reference = makeReference("NSC");
  await persist("contact", reference, data);
  return { ok: true, reference };
}
