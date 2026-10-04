import { Search } from "lucide-react";
import { getCurrentUser, isAdmin } from "@/lib/server/auth";
import { TIERS } from "@/lib/tiers";
import { formatDate } from "@/lib/utils";
import { adminMembers } from "@/services/admin";
import { updateMember } from "../actions";
import { AdminHeader, Panel, selectClass, smallButton } from "@/components/admin/ui";

export const metadata = { title: "Members" };

export default async function AdminMembersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const [me, members] = await Promise.all([getCurrentUser(), adminMembers(q.trim().slice(0, 100) || undefined)]);

  return (
    <div>
      <AdminHeader eyebrow="Admin desk" title="Members">
        <form className="relative w-full sm:w-72" role="search">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name or email"
            aria-label="Search members"
            className="h-10 w-full rounded-md border border-line-strong bg-ink/60 pr-3 pl-9 text-sm text-bone outline-none placeholder:text-faint focus:border-cyan/60"
          />
        </form>
      </AdminHeader>

      <Panel className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead className="label-mono bg-night">
              <tr>
                {["Member", "Joined", "Tier & role", ""].map((h) => (
                  <th key={h} scope="col" className="px-5 py-4 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {members.map((u) => {
                const self = u.id === me?.id;
                return (
                  <tr key={u.id} className="align-middle">
                    <th scope="row" className="px-5 py-4 font-normal">
                      <p className="text-bone">
                        {u.name} {self && <span className="font-mono text-[0.625rem] text-gold">(you)</span>}
                      </p>
                      <p className="font-mono text-[0.6875rem] text-muted">{u.email}</p>
                      {u.telegram && <p className="font-mono text-[0.6875rem] text-faint">{u.telegram}</p>}
                    </th>
                    <td className="px-5 py-4 font-mono text-xs text-mist">{formatDate(u.createdAt.toISOString())}</td>
                    <td className="px-5 py-4" colSpan={2}>
                      <form action={updateMember} className="flex flex-wrap items-center gap-2">
                        <input type="hidden" name="id" value={u.id} />
                        <select name="tier" defaultValue={u.tier} aria-label={`Tier for ${u.name}`} className={selectClass}>
                          {TIERS.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                        <select
                          name="role"
                          defaultValue={isAdmin(u) ? "admin" : u.role}
                          aria-label={`Role for ${u.name}`}
                          className={selectClass}
                          disabled={self}
                        >
                          <option value="member">Member</option>
                          <option value="analyst">Analyst</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button type="submit" className={smallButton}>
                          Save
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
              {members.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-muted">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
      <p className="mt-4 text-xs text-faint">
        Observers can browse the members&apos; site and apply. Member tier and above unlock elite trades.
      </p>
    </div>
  );
}
