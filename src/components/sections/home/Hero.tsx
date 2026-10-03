"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { HeroVisual } from "@/components/visuals/HeroVisual";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.1, delay, ease },
        };

  return (
    <section className="noise relative isolate overflow-hidden pt-32 pb-24 sm:pt-40 lg:min-h-[min(100svh,62rem)] lg:pt-44 lg:pb-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
        <div className="animate-drift absolute -top-1/4 right-[-10%] h-[50rem] w-[50rem] rounded-full bg-gold/[0.07] blur-[150px]" />
        <div className="absolute bottom-0 left-0 h-[30rem] w-[30rem] rounded-full bg-white/[0.025] blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
      </div>

      <div className="container-luxe grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 xl:col-span-6">
          <motion.div {...fade(0.1)} className="flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-gradient-to-r from-transparent to-gold" />
            <p className="eyebrow">Private trading &amp; capital</p>
          </motion.div>

          <motion.h1
            {...fade(0.2)}
            className="mt-7 font-display text-[3.1rem] leading-[0.95] font-light tracking-[-0.035em] text-bone sm:text-7xl xl:text-[5.75rem]"
          >
            <span className="block text-[0.32em] font-normal tracking-[0.5em] text-gold uppercase">The</span>
            <span className="mt-2 block">Neo</span>
            <span className="block text-gold-gradient animate-shimmer">Syndicate</span>
          </motion.h1>

          <motion.p
            {...fade(0.35)}
            className="mt-8 text-[0.75rem] font-medium tracking-[0.42em] text-bone/90 uppercase sm:text-sm"
          >
            Capital. Strategy. Execution.
          </motion.p>

          <motion.p {...fade(0.45)} className="mt-6 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
            A private trading and investment ecosystem built around disciplined execution, market intelligence and
            strategic capital growth.
          </motion.p>

          <motion.div {...fade(0.6)} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/invest#apply" size="lg" icon>
              Join the Syndicate
            </ButtonLink>
            <ButtonLink href="/trades" size="lg" variant="secondary">
              Explore our trading
            </ButtonLink>
          </motion.div>

          <motion.dl
            {...fade(0.75)}
            className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-7"
          >
            {[
              ["Focus", "XAUUSD · BTCUSD"],
              ["Approach", "Risk-first"],
              ["Access", "Members"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[0.5625rem] tracking-[0.26em] text-faint uppercase">{k}</dt>
                <dd className="mt-2 text-xs text-bone sm:text-sm">{v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:col-span-6 lg:max-w-none xl:pl-6">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
