import Link from "next/link";
import type { MarketSnapshot as Snapshot } from "@/lib/types";
import { MarketCard } from "@/components/cards/MarketCard";
import { DataSourceBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function MarketSnapshot({ snapshot }: { snapshot: Snapshot }) {
  return (
    <section aria-labelledby="snapshot-heading" className="relative py-20 sm:py-28">
      <div className="container-luxe">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Market snapshot"
            title={<span id="snapshot-heading">The instruments we watch closest.</span>}
          />
          <Reveal delay={0.1} className="flex flex-col items-start gap-3 md:items-end">
            <DataSourceBadge source={snapshot.source} label={snapshot.source === "demo" ? "Demo data · not live prices" : snapshot.source === "live" ? "Live market data" : "Partially live"} />
            <Link href="/markets" className="text-[0.6875rem] tracking-[0.22em] text-mist uppercase transition-colors hover:text-gold-light">
              Market intelligence →
            </Link>
          </Reveal>
        </div>

        <div className="-mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 lg:gap-6 [&::-webkit-scrollbar]:hidden">
          {snapshot.quotes.map((quote, i) => (
            <Reveal key={quote.symbol} delay={i * 0.1} className="w-[85%] shrink-0 snap-center sm:w-auto">
              <MarketCard quote={quote} className="h-full" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
