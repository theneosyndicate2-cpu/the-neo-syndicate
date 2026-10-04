import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Small presentational helpers shared by the admin pages. */

export function AdminHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 font-display text-3xl font-light tracking-[-0.02em] text-bone sm:text-4xl">{title}</h1>
      </div>
      {children}
    </header>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("hud relative rounded-3xl border border-line bg-charcoal p-5 sm:p-7", className)}>{children}</section>;
}

const statusTone: Record<string, string> = {
  received: "border-cyan/40 text-cyan-light",
  "under-review": "border-gold/50 text-gold-light",
  approved: "border-up/50 text-up",
  declined: "border-down/50 text-down",
  OPEN: "border-gold/50 text-gold-light",
  CLOSED: "border-line-strong text-mist",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-sm border px-2 py-0.5 font-mono text-[0.5625rem] tracking-[0.16em] whitespace-nowrap uppercase", statusTone[status] ?? "border-line-strong text-mist")}>
      {status.replace("-", " ")}
    </span>
  );
}

export const selectClass =
  "h-9 rounded-md border border-line-strong bg-ink/60 px-2.5 font-mono text-[0.6875rem] tracking-[0.06em] text-bone outline-none focus:border-cyan/60 [&>option]:bg-charcoal";

export const smallButton =
  "chamfer h-9 bg-cyan/[0.08] px-3.5 font-mono text-[0.625rem] tracking-[0.14em] text-cyan-light uppercase shadow-[inset_0_0_0_1px_rgba(56,225,255,0.35)] transition-colors hover:bg-cyan/[0.16] hover:text-white";
