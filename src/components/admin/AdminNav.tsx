"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, LineChart, Megaphone, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/trades", label: "Trades", icon: LineChart },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
];

export function AdminNav({ pending }: { pending: number }) {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  return (
    <nav aria-label="Admin" className="-mx-5 overflow-x-auto px-5 lg:mx-0 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
      <ul className="flex gap-1 lg:flex-col">
        {items.map(({ href, label, icon: Icon }) => (
          <li key={href} className="shrink-0">
            <Link
              href={href}
              aria-current={active(href) ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-4 py-3 font-mono text-[0.75rem] tracking-[0.1em] whitespace-nowrap uppercase transition-all duration-300",
                active(href) ? "bg-gold/[0.08] text-gold-light" : "text-muted hover:bg-white/[0.03] hover:text-bone",
              )}
            >
              {active(href) && <span aria-hidden className="absolute inset-y-2 left-0 hidden w-0.5 rounded-full bg-gold lg:block" />}
              <Icon className="size-4" aria-hidden />
              {label}
              {href === "/admin/applications" && pending > 0 && (
                <span className="ml-auto rounded-sm bg-cyan/15 px-1.5 py-0.5 text-[0.625rem] text-cyan-light">{pending}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
