"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FlaskConical, LoaderCircle } from "lucide-react";
import type { VerificationStartResponse } from "@/lib/types";
import { requestJSON } from "@/lib/submit";
import { passwordProblem } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { FieldShell, Input } from "@/components/forms/Field";
import { OtpInput } from "@/components/forms/OtpInput";
import { PasswordInput } from "./PasswordInput";

/** Forgot password: email → code + new password → signed in. */
export function ResetPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [challenge, setChallenge] = useState<{ token: string; testCode?: string } | null>(null);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function requestCode(e?: FormEvent) {
    e?.preventDefault();
    setError("");
    setBusy(true);
    const res = await requestJSON<VerificationStartResponse>("/api/auth/password/forgot", "POST", { email });
    setBusy(false);
    if (!res.ok || !res.token) {
      setError(res.message ?? "Please try again.");
      return;
    }
    setChallenge({ token: res.token, testCode: res.testCode });
  }

  async function reset(e: FormEvent) {
    e.preventDefault();
    if (!challenge) return;
    const problem = passwordProblem(password, email);
    if (code.length !== 6) return setError("Enter the 6-digit code from your email.");
    if (problem) return setError(problem);
    setError("");
    setBusy(true);
    const res = await requestJSON<{ ok: boolean; message?: string; expired?: boolean }>("/api/auth/password/reset", "POST", {
      email,
      token: challenge.token,
      code,
      password,
    });
    if (!res.ok) {
      setBusy(false);
      setCode("");
      setError(res.message ?? "Reset failed.");
      if (res.expired) setChallenge(null);
      return;
    }
    router.replace("/portal");
    router.refresh();
  }

  if (!challenge) {
    return (
      <form onSubmit={requestCode} className="flex flex-col gap-5" noValidate>
        <FieldShell id="fp-email" label="Account email">
          <Input id="fp-email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
        </FieldShell>
        <p role="alert" aria-live="polite" className="min-h-5 text-sm text-down">
          {error}
        </p>
        <Button type="submit" size="lg" disabled={busy} className="w-full">
          {busy ? <LoaderCircle className="size-4 animate-spin" aria-label="Sending" /> : "Send reset code"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={reset} className="flex flex-col gap-5" noValidate>
      <p className="text-sm leading-relaxed text-mist">
        If an account exists for <span className="break-all text-bone">{email}</span>, we&apos;ve sent it a 6-digit code.
      </p>
      {challenge.testCode && (
        <p className="flex items-start gap-3 rounded-lg border border-gold/30 bg-gold/[0.06] p-3.5 font-mono text-xs text-gold-light">
          <FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            TEST MODE — code: <span className="tracking-[0.3em] text-bone">{challenge.testCode}</span>
          </span>
        </p>
      )}
      <OtpInput value={code} onChange={setCode} disabled={busy} autoFocus />
      <FieldShell id="fp-password" label="New password">
        <PasswordInput id="fp-password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} showStrength />
      </FieldShell>
      <p role="alert" aria-live="polite" className="min-h-5 text-sm text-down">
        {error}
      </p>
      <Button type="submit" size="lg" disabled={busy} className="w-full">
        {busy ? <LoaderCircle className="size-4 animate-spin" aria-label="Saving" /> : "Set new password"}
      </Button>
      <button type="button" onClick={() => setChallenge(null)} className="font-mono text-[0.6875rem] tracking-[0.1em] text-muted uppercase hover:text-bone">
        Use a different email
      </button>
    </form>
  );
}
