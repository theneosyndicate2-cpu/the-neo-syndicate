import type { ApplicationPayload, ContactPayload } from "@/lib/types";

/** Shared client + server validation. Pure functions, no dependencies. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEGRAM_RE = /^@?[a-zA-Z0-9_]{5,32}$/;

type Errors = Record<string, string>;

const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function validateApplication(input: Partial<ApplicationPayload>): {
  data?: ApplicationPayload;
  errors: Errors;
} {
  const data: ApplicationPayload = {
    fullName: str(input.fullName, 120),
    email: str(input.email, 200).toLowerCase(),
    telegram: str(input.telegram, 40),
    country: str(input.country, 80),
    amount: str(input.amount, 40),
    pool: str(input.pool, 80),
    message: str(input.message, 2000),
    acknowledgeRisk: input.acknowledgeRisk === true,
  };
  const errors: Errors = {};

  if (data.fullName.length < 2) errors.fullName = "Please enter your full name.";
  if (!EMAIL_RE.test(data.email)) errors.email = "Please enter a valid email address.";
  if (data.telegram && !TELEGRAM_RE.test(data.telegram))
    errors.telegram = "Use a valid Telegram username, e.g. @username.";
  if (!data.country) errors.country = "Please select your country.";
  const amount = Number(data.amount.replace(/[^0-9.]/g, ""));
  if (!data.amount || Number.isNaN(amount) || amount < 300)
    errors.amount = "Minimum participation is £300.";
  if (!data.pool) errors.pool = "Please choose a pool.";
  if (!data.acknowledgeRisk) errors.acknowledgeRisk = "Please confirm you understand the risks.";

  return Object.keys(errors).length ? { errors } : { data, errors };
}

export function validateContact(input: Partial<ContactPayload>): { data?: ContactPayload; errors: Errors } {
  const data: ContactPayload = {
    name: str(input.name, 120),
    email: str(input.email, 200).toLowerCase(),
    telegram: str(input.telegram, 40),
    subject: str(input.subject, 160),
    message: str(input.message, 4000),
  };
  const errors: Errors = {};

  if (data.name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(data.email)) errors.email = "Please enter a valid email address.";
  if (data.telegram && !TELEGRAM_RE.test(data.telegram))
    errors.telegram = "Use a valid Telegram username, e.g. @username.";
  if (!data.subject) errors.subject = "Please add a subject.";
  if (data.message.length < 10) errors.message = "Please write at least a short message.";

  return Object.keys(errors).length ? { errors } : { data, errors };
}
