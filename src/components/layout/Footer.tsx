import Link from "next/link";
import { legalLinks, navLinks, RISK_DISCLAIMER_SHORT, siteConfig } from "@/lib/site";
import { Wordmark } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/sections/SocialLinks";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line bg-night">
      <div aria-hidden className="hairline-gold absolute inset-x-0 top-0 opacity-50" />
      <div className="container-luxe py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" aria-label="The Neo Syndicate — home" className="inline-block">
              <Wordmark />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
              A private trading and investment ecosystem built around disciplined execution, market intelligence and
              strategic capital growth.
            </p>
            <p className="mt-6 text-[0.625rem] tracking-[0.34em] text-gold uppercase">{siteConfig.tagline}</p>
            <SocialLinks className="mt-8" />
          </div>

          <div className="grid grid-cols-2 gap-10 lg:col-span-7 lg:grid-cols-3">
            <div>
              <p className="text-[0.625rem] tracking-[0.28em] text-faint uppercase">Explore</p>
              <ul className="mt-5 space-y-3">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-mist transition-colors hover:text-gold-light">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[0.625rem] tracking-[0.28em] text-faint uppercase">Legal</p>
              <ul className="mt-5 space-y-3">
                {legalLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-mist transition-colors hover:text-gold-light">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <p className="text-[0.625rem] tracking-[0.28em] text-faint uppercase">Desk</p>
              <ul className="mt-5 space-y-3 text-sm text-mist">
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-gold-light">
                    {siteConfig.email}
                  </a>
                </li>
                <li>
                  <Link href="/invest#apply" className="transition-colors hover:text-gold-light">
                    Apply for pool access
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-line bg-white/[0.015] p-5 sm:p-6">
          <p className="text-xs leading-relaxed text-muted">
            <span className="mr-2 text-[0.625rem] tracking-[0.24em] text-gold uppercase">Risk warning</span>
            {RISK_DISCLAIMER_SHORT}{" "}
            <Link href="/risk-disclosure" className="text-mist underline underline-offset-2 hover:text-gold-light">
              Read the full risk disclosure
            </Link>
            .
          </p>
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-end">
          <p className="text-xs text-faint">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="font-display text-2xl font-light tracking-[0.3em] text-gold-gradient uppercase sm:text-3xl">
            {siteConfig.signature}
          </p>
        </div>
      </div>
    </footer>
  );
}
