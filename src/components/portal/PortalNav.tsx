"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FileText, LayoutDashboard, LineChart, LogOut, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";
import { requestJSON } from "@/lib/submit";

const items = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/trades", label: "Elite trades", icon: LineChart },
  { href: "/portal/applications", label: "Applications", icon: FileText },
  { href: "/portal/account", label: "Account", icon: UserCog },
];

export function SignOutButton({ className, compact }: { className?: string; compact?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await requestJSON("/api/auth/logout", "POST");
        router.replace("/login");
        router.refresh();
      }}
      className={cn(
        "flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.12em] text-muted uppercase transition-colors hover:text-down disabled:opacity-50",
        className,
      )}
    >
      <LogOut className="size-4" aria-hidden />
      {!compact && "Sign out"}
      {compact && <span className="sr-only">Sign out</span>}
    </button>
  );
}

/** Sidebar on desktop, bottom tab bar on mobile. */
export function PortalNav() {
  const pathname = usePathname();
  const active = (href: string) => (href === "/portal" ? pathname === "/portal" : pathname.startsWith(href));

  return (
    <>
      <nav aria-label="Portal" className="hidden lg:block">
        <ul className="flex flex-col gap-1">
          {items.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={active(href) ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-4 py-3 font-mono text-[0.75rem] tracking-[0.1em] uppercase transition-all duration-300",
                  active(href) ? "bg-cyan/[0.08] text-cyan-light" : "text-muted hover:bg-white/[0.03] hover:text-bone",
                )}
              >
                {active(href) && <span aria-hidden className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-cyan shadow-[0_0_10px_rgba(56,225,255,0.9)]" />}
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t border-line pt-6">
          <SignOutButton className="px-4" />
        </div>
      </nav>

      <nav aria-label="Portal" data-portal-tabbar className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/90 backdrop-blur-xl lg:hidden">
        <ul className="grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
          {items.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={active(href) ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-3 font-mono text-[0.5625rem] tracking-[0.08em] uppercase",
                  active(href) ? "text-cyan-light" : "text-muted",
                )}
              >
                <Icon className="size-5" aria-hidden />
                {label.split(" ").pop()}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
