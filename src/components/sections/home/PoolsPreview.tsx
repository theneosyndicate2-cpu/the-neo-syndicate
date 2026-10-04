import type { InvestmentPool } from "@/lib/types";
import { InvestmentCard } from "@/components/cards/InvestmentCard";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function PoolsPreview({ pools }: { pools: InvestmentPool[] }) {
  return (
    <section aria-labelledby="pools-heading" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute top-1/3 -left-40 h-[30rem] w-[30rem] rounded-full bg-gold/[0.05] blur-[120px]" />
      <div className="container-luxe relative">
        <SectionHeading
          eyebrow="Investment pools"
          title={
            <span id="pools-heading">
              Strategic capital. <span className="text-accent">Disciplined execution.</span>
            </span>
          }
          description="Investment pools give qualified members structured access to selected Syndicate strategies — with defined durations, defined risk parameters and clear reporting."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pools.map((pool, i) => (
            <Reveal key={pool.id} delay={i * 0.1} className="h-full">
              <InvestmentCard pool={pool} variant="summary" featured={i === 0} className="h-full" />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex justify-end">
          <ButtonLink href="/invest" size="lg" variant="secondary" icon>
            View investment opportunities
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
