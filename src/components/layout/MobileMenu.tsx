"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { navLinks, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { SocialLinks } from "@/components/sections/SocialLinks";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
}

export function MobileMenu({ open, onClose, isActive }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-40 flex flex-col bg-ink/[0.97] backdrop-blur-2xl lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.1 } }}
          transition={{ duration: 0.4 }}
        >
          <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
          <nav aria-label="Mobile" className="container-luxe relative flex flex-1 flex-col overflow-y-auto pt-28 pb-10">
            <ul className="flex flex-col">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.55, delay: 0.06 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-line"
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className="flex items-baseline justify-between py-4.5"
                  >
                    <span
                      className={cn(
                        "font-display text-[1.75rem] font-light tracking-tight",
                        isActive(link.href) ? "text-gold-light" : "text-bone",
                      )}
                    >
                      {link.label}
                    </span>
                    <span className="tabular text-[0.625rem] tracking-[0.2em] text-faint">0{i + 1}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className="mt-auto flex flex-col gap-6 pt-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <ButtonLink href="/invest#apply" size="lg" icon className="w-full" onClick={onClose}>
                Join the Syndicate
              </ButtonLink>
              <div className="flex items-center justify-between">
                <p className="text-[0.625rem] tracking-[0.3em] text-muted uppercase">{siteConfig.tagline}</p>
                <SocialLinks />
              </div>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
