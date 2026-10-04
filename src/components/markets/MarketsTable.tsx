"use client";

import type { MarketSnapshot } from "@/lib/types";
import { cn, formatDateTime, formatSigned } from "@/lib/utils";
import { useMarketSnapshot } from "./MarketProvider";
import { LivePrice } from "./LivePrice";
import { QuoteStatusBadge } from "./StatusBadge";

export function MarketsTable({ initial }: { initial: MarketSnapshot }) {
  const snapshot = useMarketSnapshot(initial);
  const isLive = snapshot.source === "live";

  return (
    <div className="overflow-x-auto rounded-3xl border border-line">
      <table className="tabular w-full min-w-[48rem] text-left text-sm">
        <caption className="sr-only">Market overview{isLive ? "" : " (includes demo data, not live prices)"}</caption>
        <thead className="label-mono bg-night">
          <tr>
            {["Asset", "Price", "Daily change", "Trend", "Sentiment", "Technical bias", "Last update"].map((h) => (
              <th key={h} scope="col" className="px-5 py-4 font-medium whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line bg-charcoal">
          {snapshot.quotes.map((q) => (
            <tr key={q.symbol} className="transition-colors hover:bg-graphite">
              <th scope="row" className="px-5 py-5 font-mono font-normal tracking-[0.12em] text-bone">
                {q.symbol}
                <span className="block font-sans text-[0.6875rem] tracking-normal text-faint">{q.name}</span>
              </th>
              <td className="px-5 py-5 font-mono text-bone">
                <LivePrice value={q.price} decimals={q.decimals} />
              </td>
              <td className={cn("px-5 py-5 font-mono", q.change > 0 ? "text-up" : q.change < 0 ? "text-down" : "text-muted")}>
                {formatSigned(q.change, q.decimals)} ({formatSigned(q.changePercent, 2, "%")})
              </td>
              <td className="px-5 py-5 text-mist capitalize">{q.trend}</td>
              <td className="px-5 py-5 text-mist capitalize">{q.sentiment.replace("-", " ")}</td>
              <td className="px-5 py-5 text-mist capitalize">{q.technicalBias}</td>
              <td className="px-5 py-5 text-xs whitespace-nowrap text-faint">
                <QuoteStatusBadge quote={q} className="mb-1.5" />
                <span className="block">{formatDateTime(q.updatedAt)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
