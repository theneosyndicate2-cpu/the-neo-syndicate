import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { DataSource, MarketQuote } from "@/lib/types";
import { cn, formatDateTime, formatNumber, formatSigned } from "@/lib/utils";
import { Sparkline } from "@/components/visuals/Sparkline";

interface MarketCardProps {
  quote: MarketQuote;
  source: DataSource;
  variant?: "compact" | "detailed";
  className?: string;
}

const trendLabel = { bullish: "Bullish", bearish: "Bearish", neutral: "Neutral" } as const;
const biasLabel = { long: "Long bias", short: "Short bias", neutral: "No bias" } as const;
const sentimentLabel = { "risk-on": "Risk-on", "risk-off": "Risk-off", mixed: "Mixed" } as const;

export function MarketCard({ quote, source, variant = "compact", className }: MarketCardProps) {
  const up = quote.change > 0;
  const flat = quote.change === 0;
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;
  const isLive = source === "live";

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-graphite/80 to-charcoal p-6 transition-all duration-700 hover:-translate-y-1 hover:border-gold/30 hover:shadow-[0_30px_80px_-40px_rgba(201,169,97,0.35)] sm:p-7",
        className,
      )}
      aria-label={`${quote.symbol} ${isLive ? "market data" : "demo market data"}`}
    >
      <div aria-hidden className="hairline-gold absolute inset-x-8 top-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-medium tracking-[0.14em] text-bone">{quote.symbol}</h3>
          <p className="mt-1 text-xs text-muted">{quote.description}</p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.5625rem] tracking-[0.18em] uppercase",
            isLive ? "border-up/40 text-up" : "border-gold/30 text-gold",
          )}
        >
          <span className={cn("size-1 rounded-full", isLive ? "animate-pulse-dot bg-up" : "bg-gold")} aria-hidden />
          {isLive ? "Live" : source === "delayed" ? "Delayed" : "Demo"}
        </span>
      </header>

      <div className="mt-7 flex items-end justify-between gap-4">
        <p className="tabular font-display text-[2rem] leading-none font-light tracking-tight text-bone sm:text-4xl">
          {formatNumber(quote.price, quote.decimals)}
        </p>
        <p
          className={cn(
            "tabular flex items-center gap-1 text-sm font-medium",
            flat ? "text-muted" : up ? "text-up" : "text-down",
          )}
        >
          <Icon className="size-4" aria-hidden />
          {formatSigned(quote.changePercent, 2, "%")}
        </p>
      </div>
      <p className="tabular mt-2 text-xs text-faint">
        Day change {formatSigned(quote.change, quote.decimals)} · H {formatNumber(quote.dayHigh, quote.decimals)} · L{" "}
        {formatNumber(quote.dayLow, quote.decimals)}
      </p>

      <Sparkline data={quote.history} positive={!(!up && !flat)} className="mt-6 -mx-1" />

      <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-5 text-[0.6875rem]">
        <div>
          <dt className="tracking-[0.16em] text-faint uppercase">Trend</dt>
          <dd className="mt-1 text-mist">{trendLabel[quote.trend]}</dd>
        </div>
        <div>
          <dt className="tracking-[0.16em] text-faint uppercase">Bias</dt>
          <dd className="mt-1 text-mist">{biasLabel[quote.technicalBias]}</dd>
        </div>
        <div>
          <dt className="tracking-[0.16em] text-faint uppercase">Sentiment</dt>
          <dd className="mt-1 text-mist">{sentimentLabel[quote.sentiment]}</dd>
        </div>
      </dl>

      {variant === "detailed" && (
        <>
          <p className="mt-6 text-sm leading-relaxed text-mist">{quote.commentary}</p>
          <ul className="mt-6 grid gap-2">
            {quote.keyLevels.map((level) => (
              <li key={level.label} className="flex items-center justify-between rounded-xl border border-line px-4 py-2.5 text-xs">
                <span className="tracking-[0.14em] text-muted uppercase">{level.label}</span>
                <span className="tabular text-bone">{formatNumber(level.value, quote.decimals)}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="mt-6 text-[0.625rem] tracking-[0.12em] text-faint uppercase">
        {isLive ? "Last update " : "Reference values · not live · "}
        {formatDateTime(quote.updatedAt)}
      </p>
    </article>
  );
}
