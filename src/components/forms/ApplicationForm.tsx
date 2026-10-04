"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { BadgeCheck, CheckCircle2, LoaderCircle } from "lucide-react";
import type {
  ApplicationPayload,
  InvestmentPool,
  VerificationConfirmResponse,
  VerificationStartResponse,
} from "@/lib/types";
import { validateApplication } from "@/lib/validation";
import { countries } from "@/lib/countries";
import { postJSON } from "@/lib/submit";
import { INVESTMENT_RISK_LINE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmailVerification } from "./EmailVerification";
import { FieldShell, Input, Select, Textarea } from "./Field";

type PoolOption = Pick<InvestmentPool, "id" | "name" | "minimum">;

const empty: ApplicationPayload = {
  fullName: "",
  email: "",
  telegram: "",
  country: "",
  amount: "",
  pool: "",
  message: "",
  acknowledgeRisk: false,
};

type Step = "details" | "verify" | "done";

interface Challenge {
  email: string;
  token: string;
  expiresAt: number;
  resendAvailableAt: number;
  testCode?: string;
}

async function postVerification<T extends { ok: boolean; message?: string }>(url: string, body: unknown): Promise<T> {
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return (await res.json()) as T;
  } catch {
    return { ok: false, message: "Network error. Please check your connection and try again." } as T;
  }
}

const normalizeEmail = (e: string) => e.trim().toLowerCase();

/**
 * Investment application with email verification:
 *   details → 6-digit code sent to the applicant's email → verified → submitted.
 * No payments are taken. The server rejects applications without a valid proof.
 */
export function ApplicationForm({ pools }: { pools: PoolOption[] }) {
  const params = useSearchParams();
  const preselected = pools.find((p) => p.id === params.get("pool"))?.id ?? "";
  const [values, setValues] = useState<ApplicationPayload>({ ...empty, pool: preselected });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<Step>("details");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [verifyError, setVerifyError] = useState<string>();
  const [proof, setProof] = useState<{ email: string; token: string } | null>(null);

  const emailVerified = !!proof && proof.email === normalizeEmail(values.email);

  const set = <K extends keyof ApplicationPayload>(key: K, value: ApplicationPayload[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors(({ [key]: _, ...rest }) => rest);
  };

  async function requestCode(email: string) {
    setBusy(true);
    setVerifyError(undefined);
    const res = await postVerification<VerificationStartResponse>("/api/verification/send", { email });
    setBusy(false);
    if (!res.ok || !res.token || !res.expiresAt) {
      if (res.retryAfter && challenge?.email === email) {
        setChallenge((c) => c && { ...c, resendAvailableAt: Date.now() + res.retryAfter! * 1000 });
        setVerifyError(res.message);
        return true;
      }
      setMessage(res.message ?? "We couldn't send a verification code. Please try again.");
      return false;
    }
    setChallenge({
      email,
      token: res.token,
      expiresAt: res.expiresAt,
      resendAvailableAt: Date.now() + (res.resendAfter ?? 60) * 1000,
      testCode: res.testCode,
    });
    return true;
  }

  async function submitApplication(proofToken: string) {
    setBusy(true);
    const result = await postJSON("/api/applications", { ...values, emailProof: proofToken });
    setBusy(false);
    if (result.ok) {
      setReference(result.reference ?? "");
      setStep("done");
      setValues({ ...empty });
      setErrors({});
      setProof(null);
      setChallenge(null);
      return;
    }
    if (result.code === "EMAIL_NOT_VERIFIED") {
      // Proof expired — start a fresh verification.
      setProof(null);
      if (await requestCode(normalizeEmail(values.email))) setStep("verify");
      return;
    }
    setStep("details");
    setErrors(result.errors ?? {});
    setMessage(result.message ?? "Something went wrong. Please try again.");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (honeypot) return;
    setMessage("");
    const { errors: clientErrors } = validateApplication(values);
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      setMessage("Please review the highlighted fields.");
      document.getElementById(`app-${Object.keys(clientErrors)[0]}`)?.focus();
      return;
    }
    if (emailVerified && proof) {
      await submitApplication(proof.token);
      return;
    }
    const email = normalizeEmail(values.email);
    // Re-use a still-valid code for the same address instead of sending another.
    const reusable = challenge && challenge.email === email && challenge.expiresAt > Date.now() + 30_000;
    if (reusable || (await requestCode(email))) setStep("verify");
  }

  async function onVerify(code: string) {
    if (!challenge) return;
    setBusy(true);
    setVerifyError(undefined);
    const res = await postVerification<VerificationConfirmResponse>("/api/verification/verify", {
      token: challenge.token,
      code,
    });
    if (!res.ok || !res.proof) {
      setBusy(false);
      if (res.expired) setChallenge((c) => c && { ...c, expiresAt: Date.now() });
      setVerifyError(res.message ?? "Verification failed. Please try again.");
      return;
    }
    setProof({ email: challenge.email, token: res.proof });
    await submitApplication(res.proof);
  }

  function closeVerification() {
    setStep("details");
    setVerifyError(undefined);
  }

  const err = (k: keyof ApplicationPayload) => errors[k];
  const describedBy = (k: string) => (errors[k] ? `app-${k}-error` : undefined);

  const stepIndex = step === "details" ? 0 : step === "verify" ? 1 : 2;

  return (
    <>
      {/* Progress */}
      <ol className="mb-8 grid grid-cols-3 gap-2 font-mono text-[0.625rem] tracking-[0.14em] uppercase" aria-label="Application progress">
        {["Details", "Verify email", "Submitted"].map((label, i) => (
          <li key={label} className="flex flex-col gap-2" aria-current={i === stepIndex ? "step" : undefined}>
            <span
              className={cn(
                "h-0.5 rounded-full transition-colors duration-500",
                i < stepIndex ? "bg-gold" : i === stepIndex ? "bg-cyan shadow-[0_0_10px_rgba(56,225,255,0.8)]" : "bg-steel",
              )}
            />
            <span className={i === stepIndex ? "text-cyan-light" : i < stepIndex ? "text-gold" : "text-faint"}>
              <span className="text-faint">0{i + 1}</span> {label}
            </span>
          </li>
        ))}
      </ol>

      <form onSubmit={onSubmit} noValidate className="relative grid gap-6 sm:grid-cols-2" aria-describedby="app-form-status">
        <FieldShell id="app-fullName" label="Full name" error={err("fullName")}>
          <Input id="app-fullName" name="fullName" autoComplete="name" value={values.fullName} onChange={(e) => set("fullName", e.target.value)} invalid={!!err("fullName")} aria-describedby={describedBy("fullName")} required />
        </FieldShell>
        <FieldShell id="app-email" label="Email" error={err("email")} hint={emailVerified ? undefined : "We'll send a 6-digit code to verify this address"}>
          <div className="relative">
            <Input id="app-email" name="email" type="email" autoComplete="email" inputMode="email" value={values.email} onChange={(e) => set("email", e.target.value)} invalid={!!err("email")} aria-describedby={describedBy("email") ?? (emailVerified ? undefined : "app-email-hint")} className={emailVerified ? "pr-28" : undefined} required />
            {emailVerified && (
              <span className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1 font-mono text-[0.625rem] tracking-[0.14em] text-up uppercase">
                <BadgeCheck className="size-3.5" aria-hidden /> Verified
              </span>
            )}
          </div>
        </FieldShell>
        <FieldShell id="app-telegram" label="Telegram username" error={err("telegram")} optional>
          <Input id="app-telegram" name="telegram" placeholder="@username" autoCapitalize="none" value={values.telegram} onChange={(e) => set("telegram", e.target.value)} invalid={!!err("telegram")} aria-describedby={describedBy("telegram")} />
        </FieldShell>
        <FieldShell id="app-country" label="Country" error={err("country")}>
          <Select id="app-country" name="country" autoComplete="country-name" value={values.country} onChange={(e) => set("country", e.target.value)} invalid={!!err("country")} aria-describedby={describedBy("country")} required>
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </FieldShell>
        <FieldShell id="app-amount" label="Investment amount (GBP)" error={err("amount")} hint="Minimum participation £300">
          <Input id="app-amount" name="amount" inputMode="decimal" placeholder="£300" value={values.amount} onChange={(e) => set("amount", e.target.value)} invalid={!!err("amount")} aria-describedby={describedBy("amount") ?? "app-amount-hint"} required />
        </FieldShell>
        <FieldShell id="app-pool" label="Preferred pool" error={err("pool")}>
          <Select id="app-pool" name="pool" value={values.pool} onChange={(e) => set("pool", e.target.value)} invalid={!!err("pool")} aria-describedby={describedBy("pool")} required>
            <option value="">Select a pool</option>
            {pools.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            <option value="undecided">Not sure yet — advise me</option>
          </Select>
        </FieldShell>
        <FieldShell id="app-message" label="Message" className="sm:col-span-2" optional>
          <Textarea id="app-message" name="message" placeholder="Your experience, goals or any questions for the desk." value={values.message} onChange={(e) => set("message", e.target.value)} />
        </FieldShell>

        {/* Honeypot (hidden from users and assistive tech) */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Company
            <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </label>
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3.5 rounded-2xl border border-line bg-white/[0.015] p-4 text-sm leading-relaxed text-mist">
            <input
              id="app-acknowledgeRisk"
              type="checkbox"
              checked={values.acknowledgeRisk}
              onChange={(e) => set("acknowledgeRisk", e.target.checked)}
              className="mt-1 size-4 shrink-0 cursor-pointer accent-[#d4af5f]"
              aria-describedby={describedBy("acknowledgeRisk")}
              aria-invalid={!!err("acknowledgeRisk") || undefined}
            />
            <span>
              I understand that {INVESTMENT_RISK_LINE.charAt(0).toLowerCase() + INVESTMENT_RISK_LINE.slice(1)} I may lose
              some or all of the capital I allocate, and submitting this form is an application only — not an
              investment, payment or commitment.
            </span>
          </label>
          {err("acknowledgeRisk") && (
            <p id="app-acknowledgeRisk-error" role="alert" className="mt-2 text-xs text-down">
              {err("acknowledgeRisk")}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <p id="app-form-status" aria-live="polite" className="text-sm text-down">
            {message}
          </p>
          <Button type="submit" size="lg" disabled={busy} className="w-full sm:w-auto">
            {busy && step === "details" ? (
              <span className="flex items-center gap-2">
                <LoaderCircle className="size-4 animate-spin" aria-hidden /> {emailVerified ? "Submitting" : "Sending code"}
              </span>
            ) : emailVerified ? (
              "Submit application"
            ) : (
              "Continue — verify email"
            )}
          </Button>
        </div>
      </form>

      <Modal open={step === "verify" && !!challenge} onClose={closeVerification} title="Verify your email">
        {challenge && (
          <EmailVerification
            email={challenge.email}
            expiresAt={challenge.expiresAt}
            resendAvailableAt={challenge.resendAvailableAt}
            testCode={challenge.testCode}
            busy={busy}
            error={verifyError}
            onVerify={onVerify}
            onResend={() => requestCode(challenge.email)}
            onChangeEmail={() => {
              closeVerification();
              setChallenge(null);
              window.setTimeout(() => document.getElementById("app-email")?.focus(), 350);
            }}
          />
        )}
      </Modal>

      <Modal open={step === "done"} onClose={() => setStep("details")} title="Application received">
        <div className="flex flex-col gap-5">
          <CheckCircle2 className="size-10 text-gold" strokeWidth={1.2} aria-hidden />
          <p className="text-sm leading-relaxed text-mist">
            Thank you — your email is verified and your application is with the desk. A member of the team will review it
            and contact you via email or Telegram. No payment has been taken and no capital is committed at this stage.
          </p>
          {reference && (
            <p className="rounded-xl border border-line px-4 py-3 font-mono text-xs tracking-[0.14em] text-muted uppercase">
              Reference <span className="tabular ml-2 text-gold-light">{reference}</span>
            </p>
          )}
          <Button variant="secondary" onClick={() => setStep("details")}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}
