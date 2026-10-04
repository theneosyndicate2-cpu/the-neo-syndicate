"use client";

import { useEffect, useState } from "react";
import { FlaskConical, LoaderCircle, MailCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OtpInput } from "./OtpInput";

interface EmailVerificationProps {
  email: string;
  expiresAt: number;
  resendAvailableAt: number;
  testCode?: string;
  busy: boolean;
  error?: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  onChangeEmail: () => void;
  /** Label of the confirm button. */
  submitLabel?: string;
}

function useNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [active]);
  return now;
}

const mmss = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/** Code-entry step shown inside the application modal. */
export function EmailVerification({
  email,
  expiresAt,
  resendAvailableAt,
  testCode,
  busy,
  error,
  onVerify,
  onResend,
  onChangeEmail,
  submitLabel = "Verify & submit application",
}: EmailVerificationProps) {
  const [code, setCode] = useState("");
  const now = useNow(true);
  const expired = now >= expiresAt;
  const canResend = now >= resendAvailableAt && !busy;

  // Clear the boxes after a failed attempt and put the cursor back in the first one.
  useEffect(() => {
    if (!error) return;
    setCode("");
    const raf = requestAnimationFrame(() =>
      document.querySelector<HTMLInputElement>('input[aria-label="Digit 1 of 6"]')?.focus(),
    );
    return () => cancelAnimationFrame(raf);
  }, [error]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <span className="hud hud-cyan relative grid size-12 shrink-0 place-items-center rounded-lg border border-line text-cyan">
          <MailCheck className="size-5" strokeWidth={1.4} aria-hidden />
        </span>
        <p className="text-sm leading-relaxed text-mist">
          We sent a 6-digit code to <span className="break-all text-bone">{email}</span>. Enter it below to confirm your
          email address.
        </p>
      </div>

      {testCode && (
        <div className="flex items-start gap-3 rounded-lg border border-gold/30 bg-gold/[0.06] p-3.5 font-mono text-xs text-gold-light">
          <FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>
            <span className="tracking-[0.16em] uppercase">Test mode</span> — no email service is connected yet, so the
            code is shown here: <span className="text-sm tracking-[0.3em] text-bone">{testCode}</span>
          </p>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code.length === 6 && !busy && !expired) onVerify(code);
        }}
        className="flex flex-col gap-4"
      >
        <OtpInput
          value={code}
          onChange={setCode}
          onComplete={(c) => !busy && !expired && onVerify(c)}
          disabled={busy || expired}
          invalid={!!error}
          autoFocus
          describedBy="otp-status"
        />

        <div id="otp-status" aria-live="polite" className="min-h-5 font-mono text-xs">
          {error ? (
            <span className="text-down">{error}</span>
          ) : expired ? (
            <span className="text-down">This code has expired. Request a new one below.</span>
          ) : (
            <span className="text-muted">
              Code expires in <span className="tabular text-cyan-light">{mmss(expiresAt - now)}</span>
            </span>
          )}
        </div>

        <Button type="submit" size="lg" disabled={code.length !== 6 || busy || expired} className="w-full">
          {busy ? (
            <span className="flex items-center gap-2">
              <LoaderCircle className="size-4 animate-spin" aria-hidden /> Verifying
            </span>
          ) : (
            submitLabel
          )}
        </Button>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 font-mono text-[0.6875rem] tracking-[0.1em] uppercase">
        <button
          type="button"
          onClick={onResend}
          disabled={!canResend}
          className="text-cyan-light transition-colors hover:text-white disabled:cursor-not-allowed disabled:text-faint"
        >
          {now < resendAvailableAt ? `Resend code in ${mmss(resendAvailableAt - now)}` : "Resend code"}
        </button>
        <button type="button" onClick={onChangeEmail} className="text-muted transition-colors hover:text-bone">
          Change email
        </button>
      </div>

      <p className="flex items-center gap-2 text-xs text-faint">
        <ShieldCheck className="size-3.5 text-gold" aria-hidden />
        Can&apos;t find it? Check your spam folder. We never ask for passwords or payments by email.
      </p>
    </div>
  );
}
