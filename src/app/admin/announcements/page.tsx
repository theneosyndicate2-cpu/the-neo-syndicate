import { Pin } from "lucide-react";
import { tierLabel } from "@/lib/tiers";
import { formatDate } from "@/lib/utils";
import { adminAnnouncements } from "@/services/admin";
import { deleteAnnouncement } from "../actions";
import { AdminHeader, Panel } from "@/components/admin/ui";
import { AnnouncementForm } from "@/components/admin/AdminForms";

export const metadata = { title: "Announcements" };

export default async function AdminAnnouncementsPage() {
  const items = await adminAnnouncements();
  return (
    <div className="flex flex-col gap-6">
      <AdminHeader eyebrow="Admin desk" title="Announcements" />
      <Panel>
        <h2 className="font-display text-xl text-bone">New announcement</h2>
        <p className="mt-1.5 text-sm text-muted">Shown on the dashboard of every member at the chosen tier and above.</p>
        <div className="mt-6">
          <AnnouncementForm />
        </div>
      </Panel>

      <ul className="flex flex-col gap-3">
        {items.map((a) => (
          <li key={a.id}>
            <Panel className="!p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-bone">
                    {a.pinned && <Pin className="size-3.5 text-gold" aria-label="Pinned" />}
                    {a.title}
                  </p>
                  <p className="mt-1 font-mono text-[0.625rem] tracking-[0.12em] text-muted uppercase">
                    {tierLabel(a.minTier)} & above · {formatDate(a.publishedAt.toISOString())}
                  </p>
                </div>
                <form action={deleteAnnouncement}>
                  <input type="hidden" name="id" value={a.id} />
                  <button type="submit" className="font-mono text-[0.625rem] tracking-[0.14em] text-muted uppercase hover:text-down">
                    Delete
                  </button>
                </form>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-mist">{a.body}</p>
            </Panel>
          </li>
        ))}
      </ul>
    </div>
  );
}
