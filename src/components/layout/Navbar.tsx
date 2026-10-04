"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { navLinks } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";

export function Navbar({ ticker }: { ticker?: ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-700",
          scrolled || open ? "bg-ink/80 backdrop-blur-xl" : "bg-gradient-to-b from-ink/80 to-transparent",
        )}
      >
        <nav aria-label="Primary" className="container-luxe flex h-18 items-center justify-between lg:h-20">
          <Link href="/" aria-label="The Neo Syndicate — home" className="relative z-[60]">
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-0.5 xl:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "group relative px-3 py-2 font-mono text-[0.6875rem] tracking-[0.12em] uppercase transition-colors duration-300 xl:px-3.5",
                    isActive(link.href) ? "text-bone" : "text-muted hover:text-bone",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "mr-1 transition-colors",
                      isActive(link.href) ? "text-cyan" : "text-faint group-hover:text-cyan/70",
                    )}
                  >
                    [
                  </span>
                  {link.label}
                  <span
                    aria-hidden
                    className={cn(
                      "ml-1 transition-colors",
                      isActive(link.href) ? "text-cyan" : "text-faint group-hover:text-cyan/70",
                    )}
                  >
                    ]
                  </span>
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-cyan shadow-[0_0_10px_rgba(56,225,255,0.9)] xl:inset-x-3.5"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden xl:block">
            <ButtonLink href="/invest#apply" size="sm" className="h-10 px-5">
              Join the Syndicate
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative z-[60] -mr-2 grid size-11 place-items-center xl:hidden"
          >
            <span className="relative block h-3 w-6">
              <span
                className={cn(
                  "absolute left-0 h-px w-6 bg-bone transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute right-0 h-px bg-gold transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  open ? "top-1.5 w-6 -rotate-45" : "top-3 w-4",
                )}
              />
            </span>
          </button>
        </nav>
        {ticker}
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} isActive={isActive} />
    </>
  );
}
