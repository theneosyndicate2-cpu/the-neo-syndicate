import type { PerformanceSummary } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { PerformanceCard } from "@/components/cards/PerformanceCard";
import { DataSourceBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatCard } from "@/components/ui/StatCard";

export function Performance({ summary }: { summary: PerformanceSummary }) {
  const isDemo = summary.source !== "live";
  return (
    <section aria-labelledby="performance-heading" className="relative bg-night py-24 sm:py-32">
      <div aria-hidden className="hairline-gold absolute inset-x-0 top-0 opacity-30" />
      <div className="container-luxe">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Performance & track record"
            title={<span id="performance-heading">Measured in risk, not in hype.</span>}
            description="We report in R — multiples of the risk taken per trade — so results stay comparable and honest regardless of account size."
          />
          <Reveal delay={0.1}>
            <DataSourceBadge source={summary.source} label={isDemo ? "Placeholder · demo data" : `Verified · as of ${formatDate(summary.asOf)}`} />
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="grid h-full grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line">
              {summary.stats.map((s) => (
                <StatCard key={s.id} {...s} />
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <PerformanceCard summary={summary} className="h-full" />
          </Reveal>
        </div>

        {isDemo && (
          <p className="mt-6 text-xs leading-relaxed text-faint">
            All performance figures on this page are illustrative placeholders and do not represent actual or verified
            results. Verified records will be published here once independently confirmed. Past performance is not
            indicative of future results.
          </p>
        )}
      </div>
    </section>
  );
}
