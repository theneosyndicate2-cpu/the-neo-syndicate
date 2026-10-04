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
import { CTASection } from "@/components/sections/CTASection";

export const revalidate = 60;

export default async function HomePage() {
  const [snapshot, performance, { pools }, recent] = await Promise.all([
    getMarketSnapshot(),
    getPerformanceSummary(),
    getInvestmentPools(),
    getRecentTrades(3),
  ]);

  return (
    <>
      <Hero snapshot={snapshot} />
      <MarketSnapshot snapshot={snapshot} />
      <WhatWeDo />
      <WhyNeo />
      <Performance summary={performance} />
      <PoolsPreview pools={pools} />
      <TradesPreview trades={recent.trades} source={recent.source} />
      <CommunityBand />
      <CTASection
        eyebrow="The Neo Syndicate"
        title={
          <>
            The next move <span className="text-gold-gradient">is yours.</span>
          </>
        }
        description="Join The Neo Syndicate."
        primary={{ href: "/invest#apply", label: "Enter the Syndicate" }}
        secondary={{ href: "/syndicate", label: "Our philosophy" }}
      />
    </>
  );
}
