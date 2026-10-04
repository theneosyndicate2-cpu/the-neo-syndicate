import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/server/auth";
import { adminOverview } from "@/services/admin";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin | The Neo Syndicate" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const { pendingApplications } = await adminOverview();

  return (
    <div className="relative min-h-[100svh] pt-32 pb-20 lg:pt-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[24rem] overflow-hidden">
        <div className="grid-bg absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute -top-24 left-1/3 h-72 w-[32rem] rounded-full bg-gold/[0.06] blur-[120px]" />
      </div>
      <div className="container-luxe grid grid-cols-1 gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
        <aside className="min-w-0 lg:sticky lg:top-36 lg:self-start">
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/[0.05] p-4">
            <ShieldCheck className="size-5 shrink-0 text-gold" aria-hidden />
            <div className="min-w-0">
              <p className="font-mono text-[0.625rem] tracking-[0.2em] text-gold uppercase">Admin desk</p>
              <p className="truncate text-sm text-bone">{admin.name}</p>
            </div>
          </div>
          <AdminNav pending={pendingApplications} />
          <Link href="/portal" className="mt-5 hidden px-4 font-mono text-[0.6875rem] tracking-[0.1em] text-muted uppercase hover:text-cyan-light lg:block">
            ← Member portal
          </Link>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
