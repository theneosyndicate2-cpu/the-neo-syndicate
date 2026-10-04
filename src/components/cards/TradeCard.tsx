import type { Trade } from "@/lib/types";
import { cn, formatDate, formatNumber, formatSigned, priceDecimals } from "@/lib/utils";

const resultTone: Record<Trade["result"], string> = {
  WIN: "text-up border-up/40 bg-up/[0.07]",
  LOSS: "text-down border-down/40 bg-down/[0.07]",
  BREAKEVEN: "text-mist border-line-strong bg-white/[0.03]",
  PENDING: "text-gold-light border-gold/40 bg-gold/[0.06]",
};

export function DirectionPill({ direction }: { direction: Trade["direction"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[0.625rem] font-semibold tracking-[0.18em]",
        direction === "BUY" ? "bg-up/15 text-up" : "bg-down/15 text-down",
      )}
    >
      {direction}
    </span>
  );
}

export function ResultPill({ trade }: { trade: Trade }) {
  const label = trade.status === "OPEN" ? "Open" : trade.result === "BREAKEVEN" ? "B/E" : trade.result;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm font-mono border px-2.5 py-0.5 text-[0.625rem] font-medium tracking-[0.16em] uppercase",
        resultTone[trade.result],
      )}
    >
      {trade.status === "OPEN" && <span className="animate-pulse-dot size-1.5 rounded-full bg-gold" aria-hidden />}
      {label}
      {trade.rMultiple !== null && trade.status === "CLOSED" && (
        <span className="tabular opacity-80">{formatSigned(trade.rMultiple, 1, "R")}</span>
      )}
    </span>
  );
}

export function TradeCard({ trade, className }: { trade: Trade; className?: string }) {
  const d = priceDecimals(trade.asset);
  return (
    <article
      className={cn(
        "hud group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-charcoal p-6 transition-all duration-700 hover:border-cyan/30 sm:p-7",
        className,
      )}
      data-spotlight
    >
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="font-mono text-base tracking-[0.14em] text-bone">{trade.asset}</h3>
          <DirectionPill direction={trade.direction} />
        </div>
        <ResultPill trade={trade} />
      </header>

      <dl className="tabular mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line font-mono text-sm">
        <div className="bg-night p-3.5">
          <dt className="label-mono">Entry</dt>
          <dd className="mt-1 text-bone">{formatNumber(trade.entry, d)}</dd>
        </div>
        <div className="bg-night p-3.5">
          <dt className="label-mono">Stop loss</dt>
          <dd className="mt-1 text-down/90">{formatNumber(trade.stopLoss, d)}</dd>
        </div>
        {trade.takeProfits.map((tp, i) => (
          <div key={i} className={cn("bg-night p-3.5", i === 2 && "col-span-2")}>
            <dt className="label-mono">TP{i + 1}</dt>
            <dd className="mt-1 text-up/90">{formatNumber(tp, d)}</dd>
          </div>
        ))}
      </dl>

      {trade.note && <p className="mt-5 text-sm leading-relaxed text-mist">{trade.note}</p>}

      <footer className="mt-auto flex items-center justify-between pt-6 font-mono label-mono">
        <span>{trade.id}</span>
        <time dateTime={trade.date}>{formatDate(trade.date)}</time>
      </footer>
    </article>
  );
}
