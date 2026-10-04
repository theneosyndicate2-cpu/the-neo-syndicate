import type { MarketQuote } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Per-quote freshness tag: LIVE (pulsing), CLOSED (last session) or DEMO. */
export function QuoteStatusBadge({ quote, className }: { quote: Pick<MarketQuote, "source" | "marketStatus">; className?: string }) {
  const state = quote.source !== "live" ? "demo" : quote.marketStatus === "closed" ? "closed" : "live";
  const styles = {
    live: "border-up/40 text-up",
    closed: "border-line-strong text-mist",
    demo: "border-gold/30 text-gold",
  }[state];
  const label = { live: "Live", closed: "Closed", demo: "Demo" }[state];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-[0.5625rem] tracking-[0.18em] uppercase",
        styles,
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1 rounded-full",
          state === "live" ? "animate-pulse-dot bg-up" : state === "closed" ? "bg-muted" : "bg-gold",
        )}
      />
      {label}
    </span>
  );
}
