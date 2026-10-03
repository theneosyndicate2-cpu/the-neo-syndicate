import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { RISK_DISCLAIMER_FULL } from "@/lib/site";
import { cn } from "@/lib/utils";

interface RiskDisclosureProps {
  /** Override the default full disclaimer text. */
  text?: string;
  title?: string;
  variant?: "panel" | "inline";
  className?: string;
}

export function RiskDisclosure({ text = RISK_DISCLAIMER_FULL, title = "Risk disclosure", variant = "panel", className }: RiskDisclosureProps) {
  if (variant === "inline") {
    return (
      <p className={cn("flex gap-3 text-xs leading-relaxed text-muted", className)}>
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
        <span>{text}</span>
      </p>
    );
  }

  return (
    <aside
      aria-label={title}
      className={cn("relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8", className)}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-gold/30 text-gold">
          <ShieldAlert className="size-5" aria-hidden />
        </span>
        <div>
          <p className="eyebrow">{title}</p>
          <p className="mt-3 text-sm leading-relaxed text-mist">{text}</p>
          <Link
            href="/risk-disclosure"
            className="mt-4 inline-block text-[0.6875rem] tracking-[0.2em] text-gold-light uppercase underline-offset-4 hover:underline"
          >
            Full risk disclosure
          </Link>
        </div>
      </div>
    </aside>
  );
}
