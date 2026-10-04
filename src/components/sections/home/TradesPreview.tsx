import type { DataSource, Trade } from "@/lib/types";
import { TradeCard } from "@/components/cards/TradeCard";
import { DataSourceBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function TradesPreview({ trades, source }: { trades: Trade[]; source: DataSource }) {
  return (
    <section aria-labelledby="trades-heading" className="relative bg-night py-24 sm:py-32">
      <div aria-hidden className="hairline-gold absolute inset-x-0 top-0 opacity-30" />
      <div className="container-luxe">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Elite trades"
            title={<span id="trades-heading">Every idea has an entry, an exit and an invalidation.</span>}
          />
          <Reveal delay={0.1}>
            <DataSourceBadge source={source} label={source === "demo" ? "Sample trades · demo data" : "Desk trade log"} />
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trades.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.1} className="h-full">
              <TradeCard trade={t} className="h-full" />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex justify-end">
          <ButtonLink href="/trades" size="lg" icon>
            Access elite trades
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
