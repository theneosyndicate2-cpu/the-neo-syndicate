"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { requestJSON } from "@/lib/submit";
import { Button } from "@/components/ui/Button";
import { FieldShell, Input } from "@/components/forms/Field";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { SignOutButton } from "./PortalNav";

function Card({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="hud relative rounded-3xl border border-line bg-charcoal p-6 sm:p-8">
      <h2 className="font-display text-xl text-bone">{title}</h2>
      {description && <p className="mt-1.5 text-sm text-muted">{description}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Status({ ok, text }: { ok: boolean; text: string }) {
  if (!text) return <span className="min-h-5" />;
  return (
    <p role="status" className={`flex min-h-5 items-center gap-2 text-sm ${ok ? "text-up" : "text-down"}`}>
      {ok && <CheckCircle2 className="size-4" aria-hidden />}
      {text}
    </p>
  );
}

const Spinner = ({ label }: { label: string }) => (
  <span className="flex items-center gap-2">
    <LoaderCircle className="size-4 animate-spin" aria-hidden /> {label}
  </span>
);

export function ProfileForm({ initial, email }: { initial: { name: string; telegram: string }; email: string }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState({ ok: false, text: "" });
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await requestJSON("/api/account", "PATCH", values);
    setBusy(false);
    setErrors(res.errors ?? {});
    setStatus(res.ok ? { ok: true, text: "Profile saved." } : { ok: false, text: res.message ?? "Couldn't save." });
    if (res.ok) router.refresh();
  }

  return (
    <Card title="Profile" description="How the desk addresses and reaches you.">
      <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2" noValidate>
        <FieldShell id="pf-name" label="Full name" error={errors.name}>
          <Input id="pf-name" autoComplete="name" value={values.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} invalid={!!errors.name} />
        </FieldShell>
        <FieldShell id="pf-telegram" label="Telegram username" error={errors.telegram} optional>
          <Input id="pf-telegram" placeholder="@username" autoCapitalize="none" value={values.telegram} onChange={(e) => setValues((v) => ({ ...v, telegram: e.target.value }))} invalid={!!errors.telegram} />
        </FieldShell>
        <FieldShell id="pf-email" label="Email" hint="Verified · contact the desk to change it" className="sm:col-span-2">
          <Input id="pf-email" value={email} readOnly aria-readonly className="opacity-70" />
        </FieldShell>
        <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <Status {...status} />
          <Button type="submit" disabled={busy}>
            {busy ? <Spinner label="Saving" /> : "Save profile"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function PasswordForm({ email }: { email: string }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState({ ok: false, text: "" });
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await requestJSON("/api/account", "POST", { action: "password", current, next });
    setBusy(false);
    setErrors(res.errors ?? {});
    setStatus(res.ok ? { ok: true, text: res.message ?? "Password updated." } : { ok: false, text: res.errors ? "" : res.message ?? "Couldn't update password." });
    if (res.ok) {
      setCurrent("");
      setNext("");
    }
  }

  return (
    <Card title="Password" description="Changing your password signs you out on all other devices.">
      <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2" noValidate>
        {/* Hidden username helps password managers associate the change. */}
        <input type="email" autoComplete="username" value={email} readOnly hidden />
        <FieldShell id="pw-current" label="Current password" error={errors.current}>
          <PasswordInput id="pw-current" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} invalid={!!errors.current} />
        </FieldShell>
        <FieldShell id="pw-next" label="New password" error={errors.next}>
          <PasswordInput id="pw-next" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} invalid={!!errors.next} showStrength />
        </FieldShell>
        <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <Status {...status} />
          <Button type="submit" disabled={busy || !current || !next}>
            {busy ? <Spinner label="Updating" /> : "Update password"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function SessionsCard() {
  const [status, setStatus] = useState({ ok: false, text: "" });
  const [busy, setBusy] = useState(false);
  return (
    <Card title="Security" description="Signed in somewhere you don't recognise? End every other session.">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Status {...status} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            variant="secondary"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              const res = await requestJSON("/api/account", "DELETE");
              setBusy(false);
              setStatus({ ok: res.ok, text: res.message ?? (res.ok ? "Done." : "Couldn't sign out other devices.") });
            }}
          >
            {busy ? <Spinner label="Working" /> : "Sign out other devices"}
          </Button>
          <SignOutButton className="justify-center py-2 lg:hidden" />
        </div>
      </div>
    </Card>
  );
}
