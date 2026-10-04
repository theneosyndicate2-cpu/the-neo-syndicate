import { getCurrentUser } from "@/lib/server/auth";
import { hasTier } from "@/lib/tiers";
import { TRADES_RISK_LINE } from "@/lib/site";
import { getTrades } from "@/services/trades";
import { TradesDashboard } from "@/components/trades/TradesDashboard";
import { LockedPanel } from "@/components/portal/LockedPanel";
import { RiskDisclosure } from "@/components/sections/RiskDisclosure";

export const metadata = { title: "Elite trades" };

export default async function PortalTradesPage() {
  const user = (await getCurrentUser())!;
  const allowed = hasTier(user.tier, "member");

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="eyebrow">Elite trades</p>
        <h1 className="mt-4 font-display text-3xl font-light tracking-[-0.02em] text-bone sm:text-4xl">Full trade log</h1>
      </header>
      {allowed ? (
        <>
          <TradesDashboard {...await getTrades()} />
          <RiskDisclosure variant="inline" text={TRADES_RISK_LINE} />
        </>
      ) : (
        <LockedPanel
          requiredTier="member"
          title="Unlock the full trade log"
          body="Upgrade to Member to see every elite setup with entries, stop losses, staged targets and results."
        />
      )}
    </div>
  );
}
