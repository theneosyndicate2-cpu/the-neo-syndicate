import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

/** Hero used by interior pages. */
export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="noise relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,black,transparent)]" />
        <div className="animate-drift absolute -top-40 left-1/2 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-gold/[0.06] blur-[140px]" />
      </div>
      <div className="container-luxe relative">
        <Reveal>
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-px w-8 bg-gold/70" />
            <p className="eyebrow">{eyebrow}</p>
          </div>
          <h1 className="mt-6 max-w-4xl font-display text-[2.75rem] leading-[1.02] font-light tracking-[-0.03em] text-bone sm:text-6xl lg:text-[5.25rem]">
            {title}
          </h1>
          {description && <p className="mt-7 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">{description}</p>}
          {children && <div className="mt-10">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}
