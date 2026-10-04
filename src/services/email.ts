import "server-only";

/**
 * Transactional email.
 *
 * Production: set RESEND_API_KEY and EMAIL_FROM (a sender on a domain verified
 * in Resend, e.g. "The Neo Syndicate <desk@theneosyndicate.com>").
 *
 * Test mode: with no provider configured, emails are not sent. Outside
 * production — or when EMAIL_DELIVERY=console — the message is logged and the
 * caller may surface the code in the UI (clearly labelled as test mode).
 */

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export type DeliveryMode = "resend" | "console" | "unconfigured";

export function deliveryMode(): DeliveryMode {
  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.EMAIL_DELIVERY === "console" || process.env.NODE_ENV !== "production") return "console";
  return "unconfigured";
}

export async function sendEmail(message: EmailMessage): Promise<void> {
  const mode = deliveryMode();

  if (mode === "resend") {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "The Neo Syndicate <onboarding@resend.dev>",
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Resend responded ${res.status}: ${detail.slice(0, 300)}`);
    }
    return;
  }

  if (mode === "console") {
    console.info(`[email:test-mode] To: ${message.to} | Subject: ${message.subject}\n${message.text}`);
    return;
  }

  throw new Error("Email delivery is not configured (set RESEND_API_KEY).");
}
