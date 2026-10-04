import type { MarketSnapshot } from "@/lib/types";
import { cn, formatNumber, formatSigned } from "@/lib/utils";

/**
 * Scrolling market ticker shown under the navigation.
 * Always states the data source; demo values are flagged as such.
 */
export function TickerTape({ snapshot }: { snapshot: MarketSnapshot }) {
  const isLive = snapshot.source === "live";
  const items = [
    ...snapshot.quotes.map((q) => ({
      key: q.symbol,
      node: (
        <>
          <span className="text-mist">{q.symbol}</span>
          <span className="text-bone">{formatNumber(q.price, q.decimals)}</span>
          <span className={cn(q.change > 0 ? "text-up" : q.change < 0 ? "text-down" : "text-muted")}>
            {q.change > 0 ? "▲" : q.change < 0 ? "▼" : "■"} {formatSigned(q.changePercent, 2, "%")}
          </span>
        </>
      ),
    })),
    { key: "risk", node: <span className="text-muted">RISK PROTOCOL <span className="text-cyan">DEFINED-FIRST</span></span> },
    { key: "focus", node: <span className="text-muted">DESK FOCUS <span className="text-gold">XAU · BTC</span></span> },
    {
      key: "src",
      node: (
        <span className={isLive ? "text-up" : "text-gold"}>
          {isLive ? "● LIVE FEED" : "● DEMO DATA — NOT LIVE PRICES"}
        </span>
      ),
    },
  ];

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item.key} className="flex items-center gap-2.5 px-6 whitespace-nowrap">
          {item.node}
          <span aria-hidden className="ml-6 text-faint">/</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="relative flex h-8 items-center overflow-hidden border-b border-line bg-ink/80 font-mono text-[0.625rem] tracking-[0.14em] [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]"
      role="region"
      aria-label={isLive ? "Market ticker" : "Market ticker (demo data, not live prices)"}
    >
      <div className="animate-ticker flex w-max hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
