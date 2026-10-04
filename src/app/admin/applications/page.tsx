import Link from "next/link";
import { Mail, Send } from "lucide-react";
import { TIERS, tierLabel } from "@/lib/tiers";
import { cn, formatDate } from "@/lib/utils";
import { adminApplications } from "@/services/admin";
import { investmentPools } from "@/data/investmentPools";
import { updateApplication } from "../actions";
import { AdminHeader, Panel, StatusPill, selectClass, smallButton } from "@/components/admin/ui";

export const metadata = { title: "Applications" };

const FILTERS = [
  { id: "", label: "All" },
  { id: "received", label: "Received" },
  { id: "under-review", label: "Under review" },
  { id: "approved", label: "Approved" },
  { id: "declined", label: "Declined" },
];
const poolName = (id: string) => investmentPools.find((p) => p.id === id)?.name ?? (id === "undecided" ? "Advise me" : id);

export default async function AdminApplicationsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = "" } = await searchParams;
  const rows = await adminApplications(FILTERS.some((f) => f.id === status) ? status || undefined : undefined);

  return (
    <div>
      <AdminHeader eyebrow="Admin desk" title="Applications" />

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {FILTERS.map((f) => (
          <Link
            key={f.id || "all"}
            href={f.id ? `/admin/applications?status=${f.id}` : "/admin/applications"}
            aria-current={status === f.id ? "page" : undefined}
            className={cn(
              "rounded-md border px-3.5 py-2 font-mono text-[0.625rem] tracking-[0.14em] uppercase transition-colors",
              status === f.id ? "border-cyan/60 bg-cyan/10 text-cyan-light" : "border-line-strong text-muted hover:text-bone",
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <Panel>
          <p className="text-sm text-muted">No applications {status ? `with status “${status.replace("-", " ")}”` : "yet"}.</p>
        </Panel>
      ) : (
        <ul className="flex flex-col gap-4">
          {rows.map(({ app, userTier }) => (
            <li key={app.id}>
              <Panel>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-display text-xl text-bone">{app.fullName}</p>
                      <StatusPill status={app.status} />
                    </div>
                    <p className="mt-1 font-mono text-[0.625rem] tracking-[0.1em] text-muted uppercase">
                      {app.reference} · {formatDate(app.createdAt.toISOString())}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 font-mono text-xs">
                    <a href={`mailto:${app.email}`} className="flex items-center gap-1.5 text-cyan-light hover:text-white">
                      <Mail className="size-3.5" aria-hidden /> {app.email}
                    </a>
                    {app.telegram && (
                      <a
                        href={`https://t.me/${app.telegram.replace(/^@/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-cyan-light hover:text-white"
                      >
                        <Send className="size-3.5" aria-hidden /> {app.telegram}
                      </a>
                    )}
                  </div>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-line py-4 font-mono text-xs sm:grid-cols-4">
                  <div>
                    <dt className="label-mono">Pool</dt>
                    <dd className="mt-1 text-bone">{poolName(app.pool)}</dd>
                  </div>
                  <div>
                    <dt className="label-mono">Amount</dt>
                    <dd className="mt-1 text-bone">£{app.amount.replace(/[^0-9.,]/g, "")}</dd>
                  </div>
                  <div>
                    <dt className="label-mono">Country</dt>
                    <dd className="mt-1 text-bone">{app.country}</dd>
                  </div>
                  <div>
                    <dt className="label-mono">Account</dt>
                    <dd className="mt-1 text-bone">{userTier ? tierLabel(userTier) : "No account yet"}</dd>
                  </div>
                </dl>

                {app.message && <p className="mt-4 text-sm leading-relaxed text-mist">“{app.message}”</p>}

                <form action={updateApplication} className="mt-5 flex flex-wrap items-end gap-3">
                  <input type="hidden" name="id" value={app.id} />
                  <label className="flex flex-col gap-1.5">
                    <span className="label-mono">Status</span>
                    <select name="status" defaultValue={app.status} className={selectClass}>
                      <option value="received">Received</option>
                      <option value="under-review">Under review</option>
                      <option value="approved">Approved</option>
                      <option value="declined">Declined</option>
                    </select>
                  </label>
                  {app.userId && (
                    <label className="flex flex-col gap-1.5">
                      <span className="label-mono">Set member tier</span>
                      <select name="tier" defaultValue="" className={selectClass}>
                        <option value="">Keep ({tierLabel(userTier ?? "observer")})</option>
                        {TIERS.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <button type="submit" className={smallButton}>
                    Save
                  </button>
                </form>
              </Panel>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
