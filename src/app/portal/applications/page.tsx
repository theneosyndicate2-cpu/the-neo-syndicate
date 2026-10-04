import { FileText } from "lucide-react";
import { getCurrentUser } from "@/lib/server/auth";
import { formatDate } from "@/lib/utils";
import { listMyApplications } from "@/services/portal";
import { investmentPools } from "@/data/investmentPools";
import { ApplicationStatus } from "@/components/portal/ApplicationStatus";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = { title: "Applications" };

const poolName = (id: string) => investmentPools.find((p) => p.id === id)?.name ?? (id === "undecided" ? "Advise me" : id);

export default async function PortalApplicationsPage() {
  const user = (await getCurrentUser())!;
  const applications = await listMyApplications(user);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Applications</p>
          <h1 className="mt-4 font-display text-3xl font-light tracking-[-0.02em] text-bone sm:text-4xl">Your applications</h1>
        </div>
        <ButtonLink href="/invest#apply" size="sm" icon>
          New application
        </ButtonLink>
      </header>

      {applications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line-strong px-6 py-16 text-center">
          <FileText className="mx-auto size-8 text-faint" strokeWidth={1.2} aria-hidden />
          <p className="mt-4 font-display text-xl text-bone">No applications yet</p>
          <p className="mt-2 text-sm text-muted">Applications you submit with {user.email} will appear here.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {applications.map((a) => (
            <li key={a.id} className="hud relative rounded-3xl border border-line bg-charcoal p-6 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xl text-bone">{poolName(a.pool)}</p>
                  <p className="mt-1 font-mono text-[0.625rem] tracking-[0.12em] text-muted uppercase">
                    {a.reference} · Submitted {formatDate(a.createdAt.toISOString())}
                  </p>
                </div>
                <dl className="flex gap-6 font-mono text-xs">
                  <div>
                    <dt className="label-mono">Amount</dt>
                    <dd className="mt-1 text-bone">£{a.amount.replace(/[^0-9.,]/g, "")}</dd>
                  </div>
                  <div>
                    <dt className="label-mono">Country</dt>
                    <dd className="mt-1 text-bone">{a.country}</dd>
                  </div>
                </dl>
              </div>
              <div className="mt-6">
                <ApplicationStatus status={a.status} />
              </div>
              {a.message && <p className="mt-5 border-t border-line pt-4 text-sm leading-relaxed text-mist">{a.message}</p>}
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs leading-relaxed text-faint">
        Applications are reviewed by the desk. Submitting an application is not an investment and no payment is taken.
      </p>
    </div>
  );
}
