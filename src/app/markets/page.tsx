import { CalendarClock, Globe2, Radar } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { cn, formatDateTime, formatNumber, formatSigned } from "@/lib/utils";
import { getMarketSnapshot } from "@/services/marketData";
import { PageHero } from "@/components/sections/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { RiskDisclosure } from "@/components/sections/RiskDisclosure";
import { MarketCard } from "@/components/cards/MarketCard";
import { DataSourceBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = pageMetadata({
  title: "Markets — XAUUSD, BTCUSD & DXY Market Intelligence",
  description:
    "Market intelligence dashboard for gold (XAUUSD), Bitcoin (BTCUSD) and the US Dollar Index (DXY): trend, sentiment, technical bias and key levels from The Neo Syndicate desk.",
  path: "/markets",
});

export const revalidate = 60;

const themes = [
  {
    icon: Globe2,
    title: "Dollar & real yields",
    body: "Gold's dominant macro drivers. We track DXY structure alongside the rates outlook to frame directional bias.",
  },
  {
    icon: Radar,
    title: "Risk sentiment",
    body: "Equity volatility, crypto flows and safe-haven demand inform how aggressively we participate.",
  },
  {
    icon: CalendarClock,
    title: "Event risk",
    body: "CPI, NFP, FOMC and central-bank speakers. Exposure is reduced into high-impact releases.",
  },
];

export default async function MarketsPage() {
  const snapshot = await getMarketSnapshot();
  const isLive = snapshot.source === "live";

  return (
    <>
      <PageHero
        eyebrow="Market intelligence"
        title={
          <>
            Read the market. <span className="text-muted">Then act.</span>
          </>
        }
        description="Trend, sentiment, technical bias and key levels for the instruments at the centre of the Syndicate's process."
      >
        <DataSourceBadge
          source={snapshot.source}
          label={isLive ? undefined : "Demo data — live market feed not yet connected"}
        />
      </PageHero>

      <section aria-label="Market overview" className="pb-20">
        <div className="container-luxe">
          {/* Overview table */}
          <Reveal>
            <div className="overflow-x-auto rounded-3xl border border-line">
              <table className="tabular w-full min-w-[44rem] text-left text-sm">
                <caption className="sr-only">Market overview{isLive ? "" : " (demo data, not live prices)"}</caption>
                <thead className="bg-night text-[0.625rem] tracking-[0.2em] text-faint uppercase">
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
                      <th scope="row" className="px-5 py-5 font-display font-normal tracking-[0.12em] text-bone">
                        {q.symbol}
                        <span className="block text-[0.6875rem] tracking-normal text-faint">{q.name}</span>
                      </th>
                      <td className="px-5 py-5 text-bone">{formatNumber(q.price, q.decimals)}</td>
                      <td className={cn("px-5 py-5", q.change > 0 ? "text-up" : q.change < 0 ? "text-down" : "text-muted")}>
                        {formatSigned(q.change, q.decimals)} ({formatSigned(q.changePercent, 2, "%")})
                      </td>
                      <td className="px-5 py-5 text-mist capitalize">{q.trend}</td>
                      <td className="px-5 py-5 text-mist capitalize">{q.sentiment.replace("-", " ")}</td>
                      <td className="px-5 py-5 text-mist capitalize">{q.technicalBias}</td>
                      <td className="px-5 py-5 text-xs whitespace-nowrap text-faint">
                        {formatDateTime(q.updatedAt)}
                        {!isLive && <span className="block text-gold/80">Not live</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {snapshot.quotes.map((q, i) => (
              <Reveal key={q.symbol} delay={i * 0.1} className="h-full">
                <MarketCard quote={q} source={snapshot.source} variant="detailed" className="h-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="themes-heading" className="relative bg-night py-24 sm:py-28">
        <div aria-hidden className="hairline-gold absolute inset-x-0 top-0 opacity-30" />
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Macro framework"
            title={<span id="themes-heading">What moves our markets.</span>}
            description="Technical structure tells us where. Macro context tells us when — and how much."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {themes.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.08} className="rounded-3xl border border-line bg-charcoal p-7 sm:p-8">
                <t.icon className="size-6 text-gold" strokeWidth={1.2} aria-hidden />
                <h3 className="mt-8 font-display text-xl text-bone">{t.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{t.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12">
            <RiskDisclosure
              title="About this data"
              text="Market commentary is general information, not personal advice. Prices displayed on this page are demonstration values until a licensed market-data provider is connected and must not be used for trading decisions."
            />
          </Reveal>
        </div>
      </section>

      <CTASection
        title={
          <>
            Intelligence, <span className="text-gold-gradient">shared daily.</span>
          </>
        }
        description="Members receive desk notes, key levels and live session breakdowns inside the community."
        primary={{ href: "/community", label: "Join the community" }}
        secondary={{ href: "/trades", label: "View elite trades" }}
      />
    </>
  );
}
