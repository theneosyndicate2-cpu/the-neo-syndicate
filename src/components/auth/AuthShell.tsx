import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/ui/Logo";

interface AuthShellProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

/** Centered terminal-style card used by sign-in, sign-up and password reset. */
export function AuthShell({ eyebrow, title, description, children, footer }: AuthShellProps) {
  return (
    <section className="noise relative isolate flex min-h-[100svh] items-center overflow-hidden pt-36 pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_45%,black,transparent)]" />
        <div className="scanlines absolute inset-0 opacity-50" />
        <div className="absolute top-1/2 left-1/2 size-[46rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(circle,black_35%,transparent_70%)]">
          <div className="animate-spin-slower absolute inset-0 rounded-full border border-dashed border-cyan/15" />
          <div className="animate-spin-rev absolute inset-[14%] rounded-full border border-gold/10" />
        </div>
        <div className="absolute top-1/3 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-cyan/[0.06] blur-[120px]" />
      </div>

      <div className="container-luxe">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex flex-col items-center text-center">
            <Link href="/" aria-label="The Neo Syndicate — home">
              <LogoMark className="size-11" />
            </Link>
            <p className="eyebrow mt-6">{eyebrow}</p>
            <h1 className="mt-4 font-display text-3xl font-light tracking-[-0.02em] text-bone sm:text-4xl">{title}</h1>
            {description && <p className="mt-3 text-sm leading-relaxed text-mist">{description}</p>}
          </div>

          <div className="glass hud relative rounded-3xl bg-charcoal/70 p-6 sm:p-8">
            <div aria-hidden className="hairline-gold absolute inset-x-10 top-0" />
            {children}
          </div>

          {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
        </div>
      </div>
    </section>
  );
}
