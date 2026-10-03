import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const control =
  "peer block w-full rounded-xl border bg-white/[0.02] px-4 text-sm text-bone placeholder:text-faint transition-colors duration-300 outline-none focus:border-gold/60 focus:bg-white/[0.04] focus-visible:outline-none";

interface FieldShellProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}

export function FieldShell({ id, label, error, hint, optional, className, children }: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="flex items-center justify-between text-[0.6875rem] tracking-[0.18em] text-mist uppercase">
        {label}
        {optional && <span className="tracking-[0.12em] text-faint normal-case">Optional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-down">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = ComponentProps<"input"> & { invalid?: boolean };

export function Input({ invalid, className, ...props }: InputProps) {
  return (
    <input
      className={cn(control, "h-12", invalid ? "border-down/60" : "border-line-strong", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

type SelectProps = ComponentProps<"select"> & { invalid?: boolean };

export function Select({ invalid, className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(control, "h-12 appearance-none pr-10 [&>option]:bg-charcoal", invalid ? "border-down/60" : "border-line-strong", className)}
        aria-invalid={invalid || undefined}
        {...props}
      >
        {children}
      </select>
      <svg aria-hidden viewBox="0 0 12 12" className="pointer-events-none absolute top-1/2 right-4 size-3 -translate-y-1/2 text-gold">
        <path d="M2 4.5 6 8l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

type TextareaProps = ComponentProps<"textarea"> & { invalid?: boolean };

export function Textarea({ invalid, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(control, "min-h-32 resize-y py-3.5", invalid ? "border-down/60" : "border-line-strong", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
