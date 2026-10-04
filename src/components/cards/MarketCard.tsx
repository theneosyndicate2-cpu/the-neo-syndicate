"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { MarketQuote } from "@/lib/types";
import { cn, formatDateTime, formatNumber, formatSigned } from "@/lib/utils";
import { Sparkline } from "@/components/visuals/Sparkline";
import { useLiveQuote } from "@/components/markets/MarketProvider";
import { LivePrice } from "@/components/markets/LivePrice";
import { QuoteStatusBadge } from "@/components/markets/StatusBadge";

interface MarketCardProps {
  /** Server-rendered quote; replaced by the live value from MarketProvider in the browser. */
  quote: MarketQuote;
  variant?: "compact" | "detailed";
  className?: string;
}

const trendLabel = { bullish: "Bullish", bearish: "Bearish", neutral: "Neutral" } as const;
const biasLabel = { long: "Long bias", short: "Short bias", neutral: "No bias" } as const;
const sentimentLabel = { "risk-on": "Risk-on", "risk-off": "Risk-off", mixed: "Mixed" } as const;

export function MarketCard({ quote: initial, variant = "compact", className }: MarketCardProps) {
  const quote = useLiveQuote(initial.symbol, initial) ?? initial;
  const up = quote.change > 0;
  const flat = quote.change === 0;
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;
  const isLive = quote.source === "live";

  return (
    <article
      className={cn(
        "hud group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-graphite/80 to-charcoal p-6 transition-all duration-700 hover:-translate-y-1 hover:border-cyan/30 hover:shadow-[0_30px_80px_-40px_rgba(56,225,255,0.35)] sm:p-7",
        className,
      )}
      data-spotlight
      aria-label={`${quote.symbol} ${isLive ? "market data" : "demo market data"}`}
    >
      <div aria-hidden className="hairline-gold absolute inset-x-8 top-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-mono text-base font-medium tracking-[0.16em] text-bone">
            <span className="text-cyan">◆</span> {quote.symbol}
          </h3>
          <p className="mt-1 text-xs text-muted">{quote.description}</p>
        </div>
        <QuoteStatusBadge quote={quote} />
      </header>

      <div className="mt-7 flex items-end justify-between gap-4">
        <p className="tabular font-display text-[2rem] leading-none font-light tracking-tight text-bone sm:text-4xl">
          <LivePrice value={quote.price} decimals={quote.decimals} />
        </p>
        <p className={cn("tabular flex items-center gap-1 text-sm font-medium", flat ? "text-muted" : up ? "text-up" : "text-down")}>
          <Icon className="size-4" aria-hidden />
          {formatSigned(quote.changePercent, 2, "%")}
        </p>
      </div>
      <p className="tabular mt-2 font-mono text-[0.6875rem] text-faint">
        Chg {formatSigned(quote.change, quote.decimals)} · H {formatNumber(quote.dayHigh, quote.decimals)} · L{" "}
        {formatNumber(quote.dayLow, quote.decimals)}
      </p>

      <Sparkline data={quote.history} positive={!(!up && !flat)} className="mt-6 -mx-1" />

      <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-5 font-mono text-[0.6875rem]">
        <div>
          <dt className="label-mono">Trend</dt>
          <dd className="mt-1 text-mist">{trendLabel[quote.trend]}</dd>
        </div>
        <div>
          <dt className="label-mono">Bias</dt>
          <dd className="mt-1 text-mist">{biasLabel[quote.technicalBias]}</dd>
        </div>
        <div>
          <dt className="label-mono">Sentiment</dt>
          <dd className="mt-1 text-mist">{sentimentLabel[quote.sentiment]}</dd>
        </div>
      </dl>

      {variant === "detailed" && (
        <>
          <p className="mt-6 text-sm leading-relaxed text-mist">{quote.commentary}</p>
          <ul className="mt-6 grid gap-2">
            {quote.keyLevels.map((level) => (
              <li key={level.label} className="flex items-center justify-between rounded-md border border-line bg-ink/40 px-4 py-2.5 font-mono text-xs">
                <span className="tracking-[0.14em] text-muted uppercase">{level.label}</span>
                <span className="tabular text-bone">{formatNumber(level.value, quote.decimals)}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="mt-6 font-mono text-[0.5625rem] leading-relaxed tracking-[0.12em] text-faint uppercase">
        {isLive ? (quote.marketStatus === "closed" ? "Last price " : "Updated ") : "Reference values · not live · "}
        {formatDateTime(quote.updatedAt)}
        {isLive && <span className="block normal-case tracking-normal text-faint/80">Source: {quote.sourceName}</span>}
      </p>
    </article>
  );
}
