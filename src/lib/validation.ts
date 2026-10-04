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


/* ---------- Accounts ---------- */

export const PASSWORD_MIN = 10;

/** Returns an error message, or null when the password is acceptable. */
export function passwordProblem(password: string, email = ""): string | null {
  if (password.length < PASSWORD_MIN) return `Use at least ${PASSWORD_MIN} characters.`;
  if (password.length > 200) return "That password is too long.";
  if (!/[a-zA-Z]/.test(password) || !/[0-9\W_]/.test(password)) return "Mix letters with numbers or symbols.";
  const local = email.split("@")[0]?.toLowerCase();
  if (local && local.length >= 4 && password.toLowerCase().includes(local)) return "Don't include your email in your password.";
  if (/^(.)\1+$/.test(password) || /^(password|qwerty|letmein|welcome)/i.test(password)) return "Choose a less common password.";
  return null;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  telegram: string;
  acceptTerms: boolean;
}

export function validateSignup(input: Partial<SignupPayload>): { data?: SignupPayload; errors: Errors } {
  const data: SignupPayload = {
    name: str(input.name, 120),
    email: str(input.email, 200).toLowerCase(),
    password: typeof input.password === "string" ? input.password : "",
    telegram: str(input.telegram, 40),
    acceptTerms: input.acceptTerms === true,
  };
  const errors: Errors = {};
  if (data.name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(data.email)) errors.email = "Please enter a valid email address.";
  const pw = passwordProblem(data.password, data.email);
  if (pw) errors.password = pw;
  if (data.telegram && !TELEGRAM_RE.test(data.telegram)) errors.telegram = "Use a valid Telegram username, e.g. @username.";
  if (!data.acceptTerms) errors.acceptTerms = "Please accept the terms and risk disclosure.";
  return Object.keys(errors).length ? { errors } : { data, errors };
}

export function validateProfile(input: { name?: unknown; telegram?: unknown }): {
  data?: { name: string; telegram: string };
  errors: Errors;
} {
  const data = { name: str(input.name, 120), telegram: str(input.telegram, 40) };
  const errors: Errors = {};
  if (data.name.length < 2) errors.name = "Please enter your name.";
  if (data.telegram && !TELEGRAM_RE.test(data.telegram)) errors.telegram = "Use a valid Telegram username, e.g. @username.";
  return Object.keys(errors).length ? { errors } : { data, errors };
}
