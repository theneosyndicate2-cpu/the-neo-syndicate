"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import type { ApplicationPayload, InvestmentPool } from "@/lib/types";
import { validateApplication } from "@/lib/validation";
import { countries } from "@/lib/countries";
import { postJSON } from "@/lib/submit";
import { INVESTMENT_RISK_LINE } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
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

/**
 * Investment application form. No payments are taken — submissions go to
 * /api/applications, which can be wired to a CRM, database or payment flow.
 */
export function ApplicationForm({ pools }: { pools: PoolOption[] }) {
  const params = useSearchParams();
  const preselected = pools.find((p) => p.id === params.get("pool"))?.id ?? "";
  const [values, setValues] = useState<ApplicationPayload>({ ...empty, pool: preselected });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const set = <K extends keyof ApplicationPayload>(key: K, value: ApplicationPayload[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors(({ [key]: _, ...rest }) => rest);
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (honeypot) return;
    const { errors: clientErrors } = validateApplication(values);
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      setMessage("Please review the highlighted fields.");
      const first = Object.keys(clientErrors)[0];
      document.getElementById(`app-${first}`)?.focus();
      return;
    }
    setStatus("submitting");
    setMessage("");
    const result = await postJSON("/api/applications", values);
    if (result.ok) {
      setReference(result.reference ?? "");
      setStatus("success");
      setValues({ ...empty });
      setErrors({});
    } else {
      setErrors(result.errors ?? {});
      setMessage(result.message ?? "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  const err = (k: keyof ApplicationPayload) => errors[k];
  const describedBy = (k: string) => (errors[k] ? `app-${k}-error` : undefined);

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="grid gap-6 sm:grid-cols-2" aria-describedby="app-form-status">
        <FieldShell id="app-fullName" label="Full name" error={err("fullName")}>
          <Input id="app-fullName" name="fullName" autoComplete="name" value={values.fullName} onChange={(e) => set("fullName", e.target.value)} invalid={!!err("fullName")} aria-describedby={describedBy("fullName")} required />
        </FieldShell>
        <FieldShell id="app-email" label="Email" error={err("email")}>
          <Input id="app-email" name="email" type="email" autoComplete="email" inputMode="email" value={values.email} onChange={(e) => set("email", e.target.value)} invalid={!!err("email")} aria-describedby={describedBy("email")} required />
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
              className="mt-1 size-4 shrink-0 cursor-pointer accent-[#c9a961]"
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
          <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
            {status === "submitting" ? (
              <span className="flex items-center gap-2">
                <LoaderCircle className="size-4 animate-spin" aria-hidden /> Submitting
              </span>
            ) : (
              "Submit application"
            )}
          </Button>
        </div>
      </form>

      <Modal open={status === "success"} onClose={() => setStatus("idle")} title="Application received">
        <div className="flex flex-col gap-5">
          <CheckCircle2 className="size-10 text-gold" strokeWidth={1.2} aria-hidden />
          <p className="text-sm leading-relaxed text-mist">
            Thank you. A member of the desk will review your application and contact you via email or Telegram. No
            payment has been taken and no capital is committed at this stage.
          </p>
          {reference && (
            <p className="rounded-xl border border-line px-4 py-3 text-xs tracking-[0.14em] text-muted uppercase">
              Reference <span className="tabular ml-2 text-gold-light">{reference}</span>
            </p>
          )}
          <Button variant="secondary" onClick={() => setStatus("idle")}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}
