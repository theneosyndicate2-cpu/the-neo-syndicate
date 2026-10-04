import { getCurrentUser } from "@/lib/server/auth";
import { hasTier } from "@/lib/tiers";
import { getMarketSnapshot } from "@/services/marketData";
import { getPerformanceSummary } from "@/services/performance";
import { getInvestmentPools } from "@/services/pools";
import { getRecentTrades } from "@/services/trades";
import { Hero } from "@/components/sections/home/Hero";
import { MarketSnapshot } from "@/components/sections/home/MarketSnapshot";
import { WhatWeDo } from "@/components/sections/home/WhatWeDo";
import { WhyNeo } from "@/components/sections/home/WhyNeo";
import { Performance } from "@/components/sections/home/Performance";
import { PoolsPreview } from "@/components/sections/home/PoolsPreview";
import { TradesPreview } from "@/components/sections/home/TradesPreview";
import { CommunityBand } from "@/components/sections/home/CommunityBand";
import { PrivateAccess } from "@/components/sections/home/PrivateAccess";
import { CTASection } from "@/components/sections/CTASection";

/** Public visitors see a members-only landing; signed-in members see the full home page. */
export default async function HomePage() {
  const [user, snapshot] = await Promise.all([getCurrentUser(), getMarketSnapshot()]);

  if (!user) {
    return (
      <>
        <Hero snapshot={snapshot} />
        <PrivateAccess />
      </>
    );
  }

  const [performance, { pools }, recent] = await Promise.all([
    getPerformanceSummary(),
    getInvestmentPools(),
    getRecentTrades(3),
  ]);
  const approved = hasTier(user.tier, "member");

  return (
    <>
      <Hero snapshot={snapshot} member />
      <MarketSnapshot snapshot={snapshot} />
      <WhatWeDo />
      <WhyNeo />
      <Performance summary={performance} />
      <PoolsPreview pools={pools} />
      {approved && <TradesPreview trades={recent.trades} source={recent.source} />}
      <CommunityBand />
      <CTASection
        eyebrow="The Neo Syndicate"
        title={
          <>
            The next move <span className="text-gold-gradient">is yours.</span>
          </>
        }
        description={approved ? "Your desk is open." : "Apply for membership to unlock elite trades and pools."}
        primary={approved ? { href: "/portal", label: "Enter the portal" } : { href: "/invest#apply", label: "Apply for membership" }}
        secondary={{ href: "/syndicate", label: "Our philosophy" }}
      />
    </>
  );
}
