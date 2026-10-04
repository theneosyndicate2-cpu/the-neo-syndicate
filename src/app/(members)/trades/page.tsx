import { pageMetadata } from "@/lib/seo";
import { getCurrentUser } from "@/lib/server/auth";
import { hasTier } from "@/lib/tiers";
import { getTrades } from "@/services/trades";
import { PageHero } from "@/components/sections/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { TradesDashboard } from "@/components/trades/TradesDashboard";
import { LockedPanel } from "@/components/portal/LockedPanel";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = pageMetadata({
  title: "Elite Trades — XAUUSD & BTCUSD Trade Log",
  description:
    "The Neo Syndicate elite trades dashboard: structured XAUUSD and BTCUSD trade setups with entry, stop loss and take-profit levels.",
  path: "/trades",
});

export default async function TradesPage() {
  const user = await getCurrentUser();
  const approved = !!user && hasTier(user.tier, "member");

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
            {approved ? (
              <TradesDashboard {...await getTrades()} />
            ) : (
              <LockedPanel
                requiredTier="member"
                title="The elite trade log is for approved members"
                body="Apply for membership to see every setup with entries, stop losses, staged targets and results."
              />
            )}
          </Reveal>
        </div>
      </section>

      {approved && (
        <CTASection
          title={
            <>
              Get the next setup <span className="text-gold-gradient">first.</span>
            </>
          }
          description="Elite trades are shared with members inside the Syndicate community."
          primary={{ href: "/community", label: "Join the community" }}
          secondary={{ href: "/markets", label: "Market intelligence" }}
        />
      )}
    </>
  );
}
