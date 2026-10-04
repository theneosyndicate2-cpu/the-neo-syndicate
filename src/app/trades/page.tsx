import { pageMetadata } from "@/lib/seo";
import { TRADES_RISK_LINE } from "@/lib/site";
import { getTrades } from "@/services/trades";
import { PageHero } from "@/components/sections/PageHero";
import { RiskDisclosure } from "@/components/sections/RiskDisclosure";
import { CTASection } from "@/components/sections/CTASection";
import { TradesDashboard } from "@/components/trades/TradesDashboard";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = pageMetadata({
  title: "Elite Trades — XAUUSD & BTCUSD Trade Log",
  description:
    "The Neo Syndicate elite trades dashboard: structured XAUUSD and BTCUSD trade setups with entry, stop loss and take-profit levels, filterable by asset, direction, result and status.",
  path: "/trades",
});

export const revalidate = 60;

export default async function TradesPage() {
  const { trades, source } = await getTrades();

  return (
    <>
      <PageHero
        eyebrow="Elite trades"
        title={
          <>
            The trade <span className="text-accent">log.</span>
          </>
        }
        description="High-conviction setups across gold and Bitcoin — each with a defined entry, invalidation and staged targets. Wins and losses are recorded alike."
      />

      <section aria-label="Trades dashboard" className="pb-20">
        <div className="container-luxe">
          <Reveal>
            <TradesDashboard trades={trades} source={source} />
          </Reveal>
          <Reveal className="mt-10">
            <RiskDisclosure title="Trading risk" text={`${TRADES_RISK_LINE} Trades shown are sample/demo data until a verified feed is connected. Nothing here is personal financial advice.`} />
          </Reveal>
        </div>
      </section>

      <CTASection
        title={
          <>
            Get the next setup <span className="text-gold-gradient">first.</span>
          </>
        }
        description="Elite trades are shared with members inside the Syndicate community."
        primary={{ href: "/community", label: "Access elite trades" }}
        secondary={{ href: "/markets", label: "Market intelligence" }}
      />
    </>
  );
}
