import type { Metadata } from "next";
import { requireUser } from "@/lib/server/auth";
import { PortalNav } from "@/components/portal/PortalNav";
import { TierBadge } from "@/components/portal/TierBadge";

export const metadata: Metadata = {
  title: { default: "Member portal", template: "%s | Portal | The Neo Syndicate" },
  robots: { index: false, follow: false },
};

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const initials = user.name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative min-h-[100svh] pt-32 pb-28 lg:pt-36 lg:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] -z-10">
        <div className="grid-bg absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute -top-20 right-1/4 h-80 w-[36rem] rounded-full bg-cyan/[0.05] blur-[120px]" />
      </div>

      <div className="container-luxe grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-12">
        <aside className="lg:sticky lg:top-36 lg:self-start">
          <div className="glass hud relative mb-6 flex items-center gap-4 rounded-2xl bg-charcoal/60 p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-gold/40 bg-gold/[0.08] font-mono text-sm text-gold-light">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm text-bone">{user.name}</p>
              <TierBadge tier={user.tier} className="mt-1.5" />
            </div>
          </div>
          <PortalNav />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
