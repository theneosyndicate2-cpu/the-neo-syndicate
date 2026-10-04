"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";
import type { VerificationStartResponse } from "@/lib/types";
import { requestJSON } from "@/lib/submit";
import { validateSignup, type SignupPayload } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { FieldShell, Input } from "@/components/forms/Field";
import { EmailVerification } from "@/components/forms/EmailVerification";
import { PasswordInput } from "./PasswordInput";

interface Challenge {
  token: string;
  expiresAt: number;
  resendAvailableAt: number;
  testCode?: string;
}

const empty: SignupPayload = { name: "", email: "", password: "", telegram: "", acceptTerms: false };

/** Sign-up: details → 6-digit email code → account created and signed in. */
export function SignupForm() {
  const router = useRouter();
  const [values, setValues] = useState<SignupPayload>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [verifyError, setVerifyError] = useState<string>();

  const set = <K extends keyof SignupPayload>(key: K, value: SignupPayload[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors(({ [key]: _, ...rest }) => rest);
  };

  async function sendCode() {
    setBusy(true);
    setVerifyError(undefined);
    const res = await requestJSON<VerificationStartResponse & { errors?: Record<string, string> }>(
      "/api/auth/signup/start",
      "POST",
      values,
    );
    setBusy(false);
    if (!res.ok || !res.token || !res.expiresAt) {
      if (challenge && res.retryAfter) {
        setChallenge({ ...challenge, resendAvailableAt: Date.now() + res.retryAfter * 1000 });
        setVerifyError(res.message);
        return;
      }
      setErrors(res.errors ?? {});
      setMessage(res.message ?? (res.errors ? "" : "We couldn't send a code. Please try again."));
      setChallenge(null);
      return;
    }
    setChallenge({
      token: res.token,
      expiresAt: res.expiresAt,
      resendAvailableAt: Date.now() + (res.resendAfter ?? 60) * 1000,
      testCode: res.testCode,
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    const { errors: clientErrors } = validateSignup(values);
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      document.getElementById(`su-${Object.keys(clientErrors)[0]}`)?.focus();
      return;
    }
    await sendCode();
  }

  async function onVerify(code: string) {
    if (!challenge) return;
    setBusy(true);
    setVerifyError(undefined);
    const res = await requestJSON<{ ok: boolean; message?: string; expired?: boolean; code?: string }>(
      "/api/auth/signup/complete",
      "POST",
      { ...values, token: challenge.token, code },
    );
    if (!res.ok) {
      setBusy(false);
      if (res.code === "EMAIL_TAKEN") {
        setChallenge(null);
        setErrors({ email: res.message ?? "An account already exists for this email." });
        return;
      }
      if (res.expired) setChallenge((c) => c && { ...c, expiresAt: Date.now() });
      setVerifyError(res.message ?? "Verification failed.");
      return;
    }
    router.replace("/portal?welcome=1");
    router.refresh();
  }

  if (challenge) {
    return (
      <div>
        <p className="mb-5 font-mono text-[0.625rem] tracking-[0.16em] text-cyan uppercase">Step 2 of 2 · Verify email</p>
        <EmailVerification
          email={values.email.trim().toLowerCase()}
          expiresAt={challenge.expiresAt}
          resendAvailableAt={challenge.resendAvailableAt}
          testCode={challenge.testCode}
          busy={busy}
          error={verifyError}
          onVerify={onVerify}
          onResend={sendCode}
          onChangeEmail={() => {
            setChallenge(null);
            window.setTimeout(() => document.getElementById("su-email")?.focus(), 50);
          }}
          submitLabel="Verify & create account"
        />
      </div>
    );
  }

  const err = (k: keyof SignupPayload) => errors[k];

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <p className="font-mono text-[0.625rem] tracking-[0.16em] text-cyan uppercase">Step 1 of 2 · Your details</p>
      <FieldShell id="su-name" label="Full name" error={err("name")}>
        <Input id="su-name" autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)} invalid={!!err("name")} autoFocus />
      </FieldShell>
      <FieldShell id="su-email" label="Email" error={err("email")} hint="We'll send a 6-digit code to verify it">
        <Input id="su-email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} invalid={!!err("email")} />
      </FieldShell>
      <FieldShell id="su-password" label="Password" error={err("password")}>
        <PasswordInput id="su-password" autoComplete="new-password" value={values.password} onChange={(e) => set("password", e.target.value)} invalid={!!err("password")} showStrength />
      </FieldShell>
      <FieldShell id="su-telegram" label="Telegram username" error={err("telegram")} optional>
        <Input id="su-telegram" placeholder="@username" autoCapitalize="none" value={values.telegram} onChange={(e) => set("telegram", e.target.value)} invalid={!!err("telegram")} />
      </FieldShell>
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-mist">
          <input
            id="su-acceptTerms"
            type="checkbox"
            checked={values.acceptTerms}
            onChange={(e) => set("acceptTerms", e.target.checked)}
            className="mt-1 size-4 shrink-0 cursor-pointer accent-[#d4af5f]"
            aria-invalid={!!err("acceptTerms") || undefined}
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="text-cyan-light hover:underline">
              terms
            </Link>
            ,{" "}
            <Link href="/privacy" className="text-cyan-light hover:underline">
              privacy policy
            </Link>{" "}
            and{" "}
            <Link href="/risk-disclosure" className="text-cyan-light hover:underline">
              risk disclosure
            </Link>
            .
          </span>
        </label>
        {err("acceptTerms") && (
          <p role="alert" className="mt-2 text-xs text-down">
            {err("acceptTerms")}
          </p>
        )}
      </div>
      {message && (
        <p role="alert" className="text-sm text-down">
          {message}
        </p>
      )}
      <Button type="submit" size="lg" disabled={busy} className="w-full">
        {busy ? (
          <span className="flex items-center gap-2">
            <LoaderCircle className="size-4 animate-spin" aria-hidden /> Sending code
          </span>
        ) : (
          "Continue — verify email"
        )}
      </Button>
    </form>
  );
}
