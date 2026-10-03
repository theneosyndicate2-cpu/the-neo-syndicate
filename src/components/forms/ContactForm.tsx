"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import type { ContactPayload } from "@/lib/types";
import { validateContact } from "@/lib/validation";
import { postJSON } from "@/lib/submit";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FieldShell, Input, Select, Textarea } from "./Field";

const empty: ContactPayload = { name: "", email: "", telegram: "", subject: "", message: "" };

const subjects = ["General enquiry", "Investment pools", "Elite trades / membership", "Partnerships", "Media", "Other"];

export function ContactForm() {
  const [values, setValues] = useState<ContactPayload>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const set = (key: keyof ContactPayload, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors(({ [key]: _, ...rest }) => rest);
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (honeypot) return;
    const { errors: clientErrors } = validateContact(values);
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      setMessage("Please review the highlighted fields.");
      document.getElementById(`contact-${Object.keys(clientErrors)[0]}`)?.focus();
      return;
    }
    setStatus("submitting");
    setMessage("");
    const result = await postJSON("/api/contact", values);
    if (result.ok) {
      setStatus("success");
      setValues(empty);
    } else {
      setStatus("idle");
      setErrors(result.errors ?? {});
      setMessage(result.message ?? "Something went wrong. Please try again.");
    }
  }

  const describedBy = (k: string) => (errors[k] ? `contact-${k}-error` : undefined);

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="grid gap-6 sm:grid-cols-2">
        <FieldShell id="contact-name" label="Name" error={errors.name}>
          <Input id="contact-name" autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)} invalid={!!errors.name} aria-describedby={describedBy("name")} required />
        </FieldShell>
        <FieldShell id="contact-email" label="Email" error={errors.email}>
          <Input id="contact-email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} invalid={!!errors.email} aria-describedby={describedBy("email")} required />
        </FieldShell>
        <FieldShell id="contact-telegram" label="Telegram" error={errors.telegram} optional>
          <Input id="contact-telegram" placeholder="@username" autoCapitalize="none" value={values.telegram} onChange={(e) => set("telegram", e.target.value)} invalid={!!errors.telegram} aria-describedby={describedBy("telegram")} />
        </FieldShell>
        <FieldShell id="contact-subject" label="Subject" error={errors.subject}>
          <Select id="contact-subject" value={values.subject} onChange={(e) => set("subject", e.target.value)} invalid={!!errors.subject} aria-describedby={describedBy("subject")} required>
            <option value="">Select a subject</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </FieldShell>
        <FieldShell id="contact-message" label="Message" error={errors.message} className="sm:col-span-2">
          <Textarea id="contact-message" value={values.message} onChange={(e) => set("message", e.target.value)} invalid={!!errors.message} aria-describedby={describedBy("message")} required />
        </FieldShell>

        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </label>
        </div>

        <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className="text-sm text-down">
            {message}
          </p>
          <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
            {status === "submitting" ? (
              <span className="flex items-center gap-2">
                <LoaderCircle className="size-4 animate-spin" aria-hidden /> Sending
              </span>
            ) : (
              "Send message"
            )}
          </Button>
        </div>
      </form>

      <Modal open={status === "success"} onClose={() => setStatus("idle")} title="Message received">
        <div className="flex flex-col gap-5">
          <CheckCircle2 className="size-10 text-gold" strokeWidth={1.2} aria-hidden />
          <p className="text-sm leading-relaxed text-mist">
            Thank you for reaching out. The desk typically responds within two business days.
          </p>
          <Button variant="secondary" onClick={() => setStatus("idle")}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}
