import Link from "next/link";
import { legalLinks, navLinks, siteConfig } from "@/lib/site";
import { getCurrentUser } from "@/lib/server/auth";
import { Wordmark } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/sections/SocialLinks";

export async function Footer() {
  const year = new Date().getFullYear();
  const user = await getCurrentUser();

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
            <p className="mt-6 font-mono text-[0.625rem] tracking-[0.34em] text-gold uppercase">{siteConfig.tagline}</p>
            <SocialLinks className="mt-8" />
          </div>

          <div className="grid grid-cols-2 gap-10 lg:col-span-7 lg:grid-cols-3">
            <div>
              <p className="label-mono">{user ? "Explore" : "Members"}</p>
              <ul className="mt-5 space-y-3">
                {(user
                  ? [...navLinks, { href: "/portal", label: "Member portal" }]
                  : [
                      { href: "/login", label: "Sign in" },
                      { href: "/signup", label: "Request access" },
                    ]
                ).map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-mist transition-colors hover:text-gold-light">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label-mono">Legal</p>
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
              <p className="label-mono">Desk</p>
              <ul className="mt-5 space-y-3 text-sm text-mist">
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-gold-light">
                    {siteConfig.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-16 text-xs text-faint">
          Trading involves risk.{" "}
          <Link href="/risk-disclosure" className="text-muted underline underline-offset-2 hover:text-gold-light">
            Risk disclosure
          </Link>
        </p>

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-end">
          <p className="text-xs text-faint">
            © {year} {siteConfig.name}. Private members&apos; site.
          </p>
          <p className="font-display text-2xl font-light tracking-[0.3em] text-gold-gradient uppercase sm:text-3xl">
            {siteConfig.signature}
          </p>
        </div>
      </div>
    </footer>
  );
}
