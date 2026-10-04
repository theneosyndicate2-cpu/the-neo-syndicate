import Link from "next/link";
import { ArrowUpRight, BellRing, Check, Lock, Pin, Sparkles } from "lucide-react";
import { getCurrentUser } from "@/lib/server/auth";
import { TIERS, hasTier, tierRank } from "@/lib/tiers";
import { cn, formatDate } from "@/lib/utils";
import { listAnnouncements, listMyApplications } from "@/services/portal";
import { getRecentTrades } from "@/services/trades";
import { getMarketSnapshot } from "@/services/marketData";
import { investmentPools } from "@/data/investmentPools";
import { TradeCard } from "@/components/cards/TradeCard";
import { ApplicationStatus } from "@/components/portal/ApplicationStatus";
import { LockedPanel } from "@/components/portal/LockedPanel";
import { MarketsTable } from "@/components/markets/MarketsTable";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = { title: "Dashboard" };

const poolName = (id: string) => investmentPools.find((p) => p.id === id)?.name ?? (id === "undecided" ? "Advise me" : id);

export default async function PortalDashboard({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const user = (await getCurrentUser())!;
  const [{ welcome }, applications, announcements, recent, snapshot] = await Promise.all([
    searchParams,
    listMyApplications(user),
    listAnnouncements(user, 5),
    getRecentTrades(2),
    getMarketSnapshot(),
  ]);
  const firstName = user.name.split(/\s+/)[0];
  const latest = applications[0];
  const canSeeTrades = hasTier(user.tier, "member");

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Member portal</p>
          <h1 className="mt-4 font-display text-3xl font-light tracking-[-0.02em] text-bone sm:text-5xl">
            {welcome ? "Welcome to the Syndicate, " : "Welcome back, "}
            <span className="text-accent">{firstName}.</span>
          </h1>
          <p className="mt-3 font-mono text-[0.6875rem] tracking-[0.12em] text-muted uppercase">
            Member since {formatDate(user.createdAt.toISOString())}
          </p>
        </div>
      </header>

      {welcome && (
        <div className="hud hud-cyan relative flex items-start gap-4 rounded-2xl border border-cyan/30 bg-cyan/[0.05] p-5">
          <Sparkles className="mt-0.5 size-5 shrink-0 text-cyan" aria-hidden />
          <p className="text-sm leading-relaxed text-mist">
            Your account is verified and active. You&apos;re starting as an <span className="text-bone">Observer</span> —
            apply for membership to unlock the full elite trade log, desk briefings and pool access.
          </p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-5">
        {/* Membership */}
        <section aria-labelledby="tier-heading" className="hud relative rounded-3xl border border-line bg-charcoal p-6 sm:p-7 xl:col-span-2">
          <h2 id="tier-heading" className="label-mono">Membership</h2>
          <ol className="mt-5 flex flex-col gap-2">
            {TIERS.map((t) => {
              const unlocked = tierRank(t.id) <= tierRank(user.tier);
              const current = t.id === user.tier;
              return (
                <li
                  key={t.id}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3.5 transition-colors",
                    current ? "border-gold/50 bg-gold/[0.06]" : "border-line",
                  )}
                >
                  <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full", unlocked ? "bg-up/15 text-up" : "bg-steel text-faint")}>
                    {unlocked ? <Check className="size-3" aria-hidden /> : <Lock className="size-2.5" aria-hidden />}
                  </span>
                  <div className="min-w-0">
                    <p className={cn("font-mono text-xs tracking-[0.12em] uppercase", current ? "text-gold-light" : unlocked ? "text-bone" : "text-muted")}>
                      {t.label} {current && <span className="ml-1 text-[0.5625rem] text-gold">· current</span>}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{t.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          {tierRank(user.tier) < TIERS.length - 1 && (
            <ButtonLink href="/invest#apply" size="sm" icon className="mt-5 w-full">
              Upgrade — apply now
            </ButtonLink>
          )}
        </section>

        <div className="flex flex-col gap-6 xl:col-span-3">
          {/* Latest application */}
          <section aria-labelledby="app-heading" className="hud relative rounded-3xl border border-line bg-charcoal p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <h2 id="app-heading" className="label-mono">Latest application</h2>
              {applications.length > 0 && (
                <Link href="/portal/applications" className="font-mono text-[0.625rem] tracking-[0.12em] text-cyan-light uppercase hover:text-white">
                  All ({applications.length}) →
                </Link>
              )}
            </div>
            {latest ? (
              <div className="mt-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-display text-xl text-bone">{poolName(latest.pool)}</p>
                  <p className="font-mono text-[0.625rem] tracking-[0.12em] text-muted uppercase">
                    {latest.reference} · {formatDate(latest.createdAt.toISOString())}
                  </p>
                </div>
                <div className="mt-5">
                  <ApplicationStatus status={latest.status} />
                </div>
              </div>
            ) : (
              <div className="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-mist">You haven&apos;t applied for a pool yet.</p>
                <ButtonLink href="/invest#apply" size="sm" variant="secondary" icon>
                  View pools
                </ButtonLink>
              </div>
            )}
          </section>

          {/* Announcements */}
          <section aria-labelledby="ann-heading" className="hud relative rounded-3xl border border-line bg-charcoal p-6 sm:p-7">
            <h2 id="ann-heading" className="label-mono flex items-center gap-2">
              <BellRing className="size-3.5 text-cyan" aria-hidden /> Desk announcements
            </h2>
            <ul className="mt-5 divide-y divide-line">
              {announcements.map((a) => (
                <li key={a.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    {a.pinned && <Pin className="size-3 text-gold" aria-label="Pinned" />}
                    <p className="text-sm text-bone">{a.title}</p>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-mist">{a.body}</p>
                  <p className="mt-2 font-mono text-[0.5625rem] tracking-[0.14em] text-faint uppercase">
                    {formatDate(a.publishedAt.toISOString())}
                  </p>
                </li>
              ))}
              {announcements.length === 0 && <li className="text-sm text-muted">No announcements yet.</li>}
            </ul>
          </section>
        </div>
      </div>

      {/* Markets */}
      <section aria-labelledby="mk-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="mk-heading" className="label-mono">Markets</h2>
          <Link href="/markets" className="font-mono text-[0.625rem] tracking-[0.12em] text-cyan-light uppercase hover:text-white">
            Intelligence →
          </Link>
        </div>
        <MarketsTable initial={snapshot} />
      </section>

      {/* Elite trades */}
      <section aria-labelledby="tr-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="tr-heading" className="label-mono">Latest elite trades</h2>
          {canSeeTrades && (
            <Link href="/portal/trades" className="flex items-center gap-1 font-mono text-[0.625rem] tracking-[0.12em] text-cyan-light uppercase hover:text-white">
              Full log <ArrowUpRight className="size-3" aria-hidden />
            </Link>
          )}
        </div>
        {canSeeTrades ? (
          <div className="grid gap-4 md:grid-cols-2">
            {recent.trades.map((t) => (
              <TradeCard key={t.id} trade={t} />
            ))}
          </div>
        ) : (
          <LockedPanel
            requiredTier="member"
            title="The elite trade log is for members"
            body="Members see every setup in real time — entries, invalidation and staged targets — with the desk's full trade history."
          />
        )}
      </section>
    </div>
  );
}
