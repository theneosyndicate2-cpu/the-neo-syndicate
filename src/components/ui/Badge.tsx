import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { DataSource } from "@/lib/types";

type Tone = "gold" | "neutral" | "up" | "down";

const tones: Record<Tone, string> = {
  gold: "border-gold/40 text-gold-light bg-gold/[0.06]",
  neutral: "border-line-strong text-mist bg-white/[0.03]",
  up: "border-up/40 text-up bg-up/[0.07]",
  down: "border-down/40 text-down bg-down/[0.07]",
};

export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.625rem] font-medium tracking-[0.16em] uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const sourceLabel: Record<DataSource, string> = {
  live: "Live",
  delayed: "Delayed",
  demo: "Demo data",
};

/** Always-visible indicator of where data comes from. Never hide this for non-live data. */
export function DataSourceBadge({ source, label, className }: { source: DataSource; label?: string; className?: string }) {
  return (
    <Badge tone={source === "live" ? "up" : "gold"} className={className}>
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", source === "live" ? "animate-pulse-dot bg-up" : "bg-gold")}
      />
      {label ?? sourceLabel[source]}
    </Badge>
  );
}
