"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { MarketSnapshot } from "@/lib/types";
import { ButtonLink } from "@/components/ui/Button";
import { OrbitalCore } from "@/components/visuals/OrbitalCore";
import { ScrambleText } from "@/components/visuals/ScrambleText";

const ease = [0.22, 1, 0.36, 1] as const;

const readouts = [
  { code: "0x01", key: "Risk", value: "Defined" },
  { code: "0x02", key: "Execution", value: "Planned" },
  { code: "0x03", key: "Access", value: "By application" },
];

export function Hero({ snapshot }: { snapshot: MarketSnapshot }) {
  const reduce = useReducedMotion();
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 1.1, delay, ease },
        };

  return (
    <section className="noise relative isolate overflow-hidden pt-36 pb-20 sm:pt-44 lg:min-h-[min(100svh,64rem)] lg:pt-48 lg:pb-28">
      {/* Background: perspective grid floor, scanlines, glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_75%_60%_at_60%_35%,black,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-[45%] [perspective:600px]">
          <div className="grid-bg absolute inset-x-[-50%] bottom-0 h-[200%] origin-bottom [transform:rotateX(68deg)] opacity-70 [mask-image:linear-gradient(to_top,black,transparent_70%)]" />
        </div>
        <div className="scanlines absolute inset-0 opacity-60" />
        <div className="animate-drift absolute -top-1/4 right-[-10%] h-[46rem] w-[46rem] rounded-full bg-cyan/[0.06] blur-[150px]" />
        <div className="absolute top-1/3 left-[-15%] h-[32rem] w-[32rem] rounded-full bg-gold/[0.07] blur-[140px]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ink" />
      </div>

      <div className="container-luxe grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="relative z-10 lg:col-span-6">
          <motion.p {...fade(0.05)} className="flex items-center gap-3 font-mono label-mono">
            <span className="text-cyan">&gt;</span>
            Private desk
            <span className="text-faint">·</span>
            <span className="text-gold">Capital &amp; markets</span>
            <span aria-hidden className="animate-blink inline-block h-3.5 w-1.5 bg-cyan" />
          </motion.p>

          <motion.h1
            {...fade(0.15)}
            className="mt-8 font-display text-[3.4rem] leading-[0.92] font-medium tracking-[-0.04em] text-bone uppercase sm:text-7xl xl:text-[6.25rem]"
          >
            <span className="mb-3 block font-mono text-[0.22em] font-normal tracking-[0.6em] text-cyan">The</span>
            <span className="block">Neo</span>
            <ScrambleText text="Syndicate" delay={500} duration={1100} className="block text-gold-gradient animate-shimmer" />
          </motion.h1>

          <motion.p
            {...fade(0.3)}
            className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs tracking-[0.3em] text-bone uppercase sm:text-sm"
          >
            <span>Capital.</span>
            <span aria-hidden className="size-1.5 rotate-45 bg-gold" />
            <span>Strategy.</span>
            <span aria-hidden className="size-1.5 rotate-45 bg-gold" />
            <span className="text-accent">Execution.</span>
          </motion.p>

          <motion.p {...fade(0.4)} className="mt-6 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
            A private trading and investment ecosystem built around disciplined execution, market intelligence and
            strategic capital growth.
          </motion.p>

          <motion.div {...fade(0.55)} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/invest#apply" size="lg" icon>
              Join the Syndicate
            </ButtonLink>
            <ButtonLink href="/trades" size="lg" variant="secondary">
              Explore our trading
            </ButtonLink>
          </motion.div>

          <motion.dl
            {...fade(0.7)}
            className="mt-12 grid max-w-xl grid-cols-3 border-y border-line font-mono"
          >
            {readouts.map((r) => (
              <div key={r.code} className="border-r border-line py-4 pr-3 last:border-r-0 [&:not(:first-child)]:pl-4">
                <dt className="label-mono">
                  <span className="text-cyan/70 normal-case">{r.code}</span> {r.key}
                </dt>
                <dd className="mt-1.5 text-[0.6875rem] tracking-[0.12em] text-bone uppercase">{r.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <div className="relative lg:col-span-6 lg:pr-14 xl:pr-0">
          <OrbitalCore initial={snapshot} />
        </div>
      </div>
    </section>
  );
}
