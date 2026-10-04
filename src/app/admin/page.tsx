import Link from "next/link";
import { TIERS } from "@/lib/tiers";
import { formatDate } from "@/lib/utils";
import { adminOverview } from "@/services/admin";
import { investmentPools } from "@/data/investmentPools";
import { AdminHeader, Panel, StatusPill } from "@/components/admin/ui";
import { TierBadge } from "@/components/portal/TierBadge";

export const metadata = { title: "Overview" };

const poolName = (id: string) => investmentPools.find((p) => p.id === id)?.name ?? (id === "undecided" ? "Advise me" : id);

export default async function AdminOverviewPage() {
  const o = await adminOverview();
  const stats = [
    { label: "Members", value: o.members, href: "/admin/members" },
    { label: "Pending applications", value: o.pendingApplications, href: "/admin/applications?status=received", accent: o.pendingApplications > 0 },
    { label: "Approved", value: o.byStatus.approved ?? 0, href: "/admin/applications?status=approved" },
    { label: "Desk trades", value: o.tradeCount, href: "/admin/trades" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader eyebrow="Admin desk" title="Overview" />

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-charcoal p-5 transition-colors hover:bg-graphite sm:p-7">
            <p className="label-mono">{s.label}</p>
            <p className={`tabular mt-3 font-display text-4xl font-light ${s.accent ? "text-accent" : "text-bone"}`}>{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <div className="flex items-center justify-between">
            <h2 className="label-mono">Members by tier</h2>
            <Link href="/admin/members" className="font-mono text-[0.625rem] tracking-[0.12em] text-cyan-light uppercase hover:text-white">
              Manage →
            </Link>
          </div>
          <ul className="mt-5 flex flex-col gap-3">
            {TIERS.map((t) => {
              const n = o.byTier[t.id] ?? 0;
              const pct = o.members ? (n / o.members) * 100 : 0;
              return (
                <li key={t.id} className="flex items-center gap-4">
                  <span className="w-32 shrink-0 font-mono text-xs tracking-[0.1em] text-mist uppercase">{t.label}</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-steel">
                    <span className="block h-full rounded-full bg-gradient-to-r from-gold-deep to-gold-light" style={{ width: `${pct}%` }} />
                  </span>
                  <span className="tabular w-8 text-right font-mono text-sm text-bone">{n}</span>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel>
          <div className="flex items-center justify-between">
            <h2 className="label-mono">Latest applications</h2>
            <Link href="/admin/applications" className="font-mono text-[0.625rem] tracking-[0.12em] text-cyan-light uppercase hover:text-white">
              Review →
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {o.recentApps.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-bone">{a.fullName}</p>
                  <p className="truncate font-mono text-[0.625rem] tracking-[0.08em] text-muted">
                    {poolName(a.pool)} · £{a.amount.replace(/[^0-9.,]/g, "")} · {formatDate(a.createdAt.toISOString())}
                  </p>
                </div>
                <StatusPill status={a.status} />
              </li>
            ))}
            {o.recentApps.length === 0 && <li className="py-3 text-sm text-muted">No applications yet.</li>}
          </ul>
        </Panel>
      </div>

      <Panel>
        <h2 className="label-mono">Newest members</h2>
        <ul className="mt-4 divide-y divide-line">
          {o.recentUsers.map((u) => (
            <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="text-sm text-bone">{u.name}</p>
                <p className="font-mono text-[0.625rem] text-muted">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[0.625rem] text-faint">{formatDate(u.createdAt.toISOString())}</span>
                <TierBadge tier={u.tier} />
              </div>
            </li>
          ))}
          {o.recentUsers.length === 0 && <li className="py-3 text-sm text-muted">No members yet.</li>}
        </ul>
      </Panel>
    </div>
  );
}
