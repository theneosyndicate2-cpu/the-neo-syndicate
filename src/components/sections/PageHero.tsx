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
    <section className="noise relative overflow-hidden pt-44 pb-16 sm:pt-52 sm:pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,black,transparent)]" />
        <div className="scanlines absolute inset-0 opacity-50" />
        <div className="animate-drift absolute -top-40 left-1/3 h-[36rem] w-[50rem] rounded-full bg-cyan/[0.05] blur-[140px]" />
        <div className="absolute -top-20 right-0 h-[24rem] w-[30rem] rounded-full bg-gold/[0.06] blur-[120px]" />
        {/* scanning beam */}
        <div className="animate-scan absolute inset-x-0 top-0 h-full">
          <div className="h-24 bg-gradient-to-b from-transparent via-cyan/[0.05] to-transparent" />
        </div>
        <div className="hairline-gold absolute inset-x-0 bottom-0 opacity-40" />
      </div>
      <div className="container-luxe relative">
        <Reveal>
          <div className="flex items-center gap-3">
            <p className="eyebrow">{eyebrow}</p>
            <span aria-hidden className="h-px w-16 bg-gradient-to-r from-cyan/60 to-transparent" />
          </div>
          <h1 className="mt-6 max-w-4xl font-display text-[2.75rem] leading-[1] font-light tracking-[-0.035em] text-bone sm:text-6xl lg:text-[5.25rem]">
            {title}
          </h1>
          {description && <p className="mt-7 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">{description}</p>}
          {children && <div className="mt-10">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}
