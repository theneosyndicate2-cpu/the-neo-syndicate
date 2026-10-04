import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

interface CTASectionProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}

export function CTASection({ eyebrow = "The Neo Syndicate", title, description, primary, secondary }: CTASectionProps) {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-[22rem] w-[min(48rem,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.08] blur-[110px]" />
        <div className="grid-bg absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_65%)]" />
        {/* portal rings */}
        <div className="absolute top-1/2 left-1/2 size-[44rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(circle,black_40%,transparent_70%)]">
          <div className="animate-spin-slower absolute inset-0 rounded-full border border-dashed border-cyan/15" />
          <div className="animate-spin-rev absolute inset-[12%] rounded-full border border-gold/15" />
          <div className="animate-spin-slow absolute inset-[24%] rounded-full border-2 border-transparent border-t-cyan/40 border-r-cyan/10" />
        </div>
      </div>
      <div className="container-luxe relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-6 font-display text-4xl leading-[1.05] font-light tracking-[-0.025em] text-bone sm:text-6xl lg:text-7xl">
            {title}
          </h2>
          {description && <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-mist sm:text-lg">{description}</p>}
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <ButtonLink href={primary.href} size="lg" icon>
              {primary.label}
            </ButtonLink>
            {secondary && (
              <ButtonLink href={secondary.href} size="lg" variant="secondary">
                {secondary.label}
              </ButtonLink>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
