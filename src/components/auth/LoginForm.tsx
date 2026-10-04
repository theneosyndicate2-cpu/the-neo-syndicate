"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { requestJSON } from "@/lib/submit";
import { Button } from "@/components/ui/Button";
import { FieldShell, Input } from "@/components/forms/Field";
import { PasswordInput } from "./PasswordInput";

/** Only allow redirects to in-site paths. */
export const safeNext = (next: string | null, fallback = "/portal") =>
  next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await requestJSON("/api/auth/login", "POST", { email, password });
    if (!res.ok) {
      setBusy(false);
      setError(res.message ?? "Sign in failed.");
      return;
    }
    router.replace(safeNext(params.get("next")));
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <FieldShell id="login-email" label="Email">
        <Input id="login-email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
      </FieldShell>
      <FieldShell id="login-password" label="Password">
        <PasswordInput id="login-password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </FieldShell>
      <div className="-mt-1 flex justify-end">
        <Link href="/forgot-password" className="font-mono text-[0.6875rem] tracking-[0.1em] text-cyan-light uppercase hover:text-white">
          Forgot password?
        </Link>
      </div>
      <p role="alert" aria-live="polite" className="min-h-5 text-sm text-down">
        {error}
      </p>
      <Button type="submit" size="lg" disabled={busy} className="w-full">
        {busy ? (
          <span className="flex items-center gap-2">
            <LoaderCircle className="size-4 animate-spin" aria-hidden /> Signing in
          </span>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
