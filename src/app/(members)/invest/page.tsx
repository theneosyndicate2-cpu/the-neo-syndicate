import Link from "next/link";
import { Suspense } from "react";
import { ClipboardCheck, FileSearch, MessagesSquare, ShieldCheck } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { getInvestmentPools } from "@/services/pools";
import { PageHero } from "@/components/sections/PageHero";
import { InvestmentCard } from "@/components/cards/InvestmentCard";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = pageMetadata({
  title: "Investment Pools — Strategic Capital, Disciplined Execution",
  description:
    "Explore The Neo Syndicate investment pools: structured, risk-defined participation in selected XAUUSD and BTCUSD trading strategies. Apply online — no payment taken at application.",
  path: "/invest",
});

const steps = [
  { icon: ClipboardCheck, title: "Apply", body: "Submit a short application. No payment is taken and nothing is committed." },
  { icon: FileSearch, title: "Review", body: "The desk reviews suitability, experience and the pool that fits your goals." },
  { icon: MessagesSquare, title: "Consultation", body: "We walk you through the strategy, risk parameters and reporting before anything else." },
  { icon: ShieldCheck, title: "Onboarding", body: "Only after full risk disclosure and written terms would any participation begin." },
];

export default async function InvestPage() {
  const { pools, placeholder } = await getInvestmentPools();

  return (
    <>
      <PageHero
        eyebrow="Investment pools"
        title={
          <>
            Investment <span className="text-gold-gradient">Pools</span>
          </>
        }
        description="Strategic capital. Disciplined execution. Structured opportunities for members looking to participate in selected Syndicate trading strategies."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#apply" size="lg" icon>
            Apply now
          </ButtonLink>
          <ButtonLink href="#pools" size="lg" variant="secondary">
            View pools
          </ButtonLink>
        </div>
      </PageHero>

      <section id="pools" aria-labelledby="pools-list-heading" className="scroll-mt-24 pb-24 sm:pb-28">
        <div className="container-luxe">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="Current pools" title={<span id="pools-list-heading">Opportunities</span>} />
            {placeholder && (
              <Reveal>
                <Badge tone="gold">Illustrative terms · subject to confirmation</Badge>
              </Reveal>
            )}
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {pools.map((pool, i) => (
              <Reveal key={pool.id} delay={i * 0.1} className="h-full">
                <InvestmentCard pool={pool} featured={i === 0} className="h-full" />
              </Reveal>
            ))}
          </div>
          {placeholder && (
            <p className="mt-8 max-w-3xl text-xs leading-relaxed text-faint">
              Pool terms, minimums and availability shown are placeholders and may change.
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="process-heading" className="relative bg-night py-24 sm:py-28">
        <div aria-hidden className="hairline-gold absolute inset-x-0 top-0 opacity-30" />
        <div className="container-luxe">
          <SectionHeading
            eyebrow="The process"
            title={<span id="process-heading">Deliberate, by design.</span>}
            description="Applications are reviewed individually. Every step is designed to make sure participation is understood and appropriate."
          />
          <ol className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.08} className="bg-charcoal p-7 sm:p-8">
                <div className="flex items-center justify-between">
                  <s.icon className="size-6 text-gold" strokeWidth={1.2} aria-hidden />
                  <span className="tabular text-[0.625rem] tracking-[0.24em] text-faint">STEP 0{i + 1}</span>
                </div>
                <h3 className="mt-8 font-display text-xl text-bone">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section id="apply" aria-labelledby="apply-heading" className="scroll-mt-20 py-24 sm:py-32">
        <div className="container-luxe grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="Application"
              title={<span id="apply-heading">Apply for pool access.</span>}
              description="Tell us a little about yourself. A member of the desk will be in touch to discuss suitability."
            />
            <Reveal delay={0.1}>
              <ul className="mt-10 space-y-4 text-sm text-mist">
                <li className="flex gap-3">
                  <span className="mt-2 h-px w-4 shrink-0 bg-gold" aria-hidden />
                  No payment is requested or processed through this form.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-px w-4 shrink-0 bg-gold" aria-hidden />
                  We will never ask for passwords, seed phrases or account logins.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-px w-4 shrink-0 bg-gold" aria-hidden />
                  Your details are handled in line with our{" "}
                  <Link href="/privacy" className="text-gold-light underline underline-offset-2">
                    privacy policy
                  </Link>
                  .
                </li>
              </ul>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-8">
            <div className="glass relative rounded-3xl bg-charcoal/60 p-6 sm:p-10">
              <div aria-hidden className="hairline-gold absolute inset-x-12 top-0" />
              <Suspense fallback={<div className="h-[42rem]" />}>
                <ApplicationForm pools={pools.map(({ id, name, minimum }) => ({ id, name, minimum }))} />
              </Suspense>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
