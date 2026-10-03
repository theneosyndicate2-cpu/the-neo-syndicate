import Link from "next/link";
import { ArrowUpRight, Crosshair, Landmark, LineChart, Radar } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const pillars = [
  {
    icon: Crosshair,
    title: "Trading",
    body: "Focused execution across XAUUSD, BTCUSD and selected markets.",
    href: "/markets",
  },
  {
    icon: LineChart,
    title: "Elite Trades",
    body: "High-conviction market setups, analysis and trade ideas.",
    href: "/trades",
  },
  {
    icon: Landmark,
    title: "Investment Pools",
    body: "Structured opportunities for members looking to participate in selected trading strategies.",
    href: "/invest",
  },
  {
    icon: Radar,
    title: "Market Intelligence",
    body: "Market analysis, macroeconomic context and strategic positioning.",
    href: "/markets",
  },
];

export function WhatWeDo() {
  return (
    <section aria-labelledby="what-heading" className="relative bg-night py-24 sm:py-32">
      <div aria-hidden className="hairline-gold absolute inset-x-0 top-0 opacity-30" />
      <div className="container-luxe">
        <SectionHeading
          eyebrow="What we do"
          title={
            <span id="what-heading">
              Four disciplines. <span className="font-serif text-gold-light italic">One standard.</span>
            </span>
          }
          description="Every part of the Syndicate is built around the same principle: process before outcome."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08} className="h-full">
              <Link
                href={p.href}
                className="group relative flex h-full min-h-[18rem] flex-col bg-charcoal p-7 transition-colors duration-700 hover:bg-graphite sm:p-8"
              >
                <div aria-hidden className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-gold to-transparent transition-transform duration-700 group-hover:scale-x-100" />
                <div className="flex items-start justify-between">
                  <span className="tabular text-[0.625rem] tracking-[0.24em] text-faint">0{i + 1}</span>
                  <ArrowUpRight className="size-4 text-faint transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" aria-hidden />
                </div>
                <p.icon className="mt-10 size-7 text-gold" strokeWidth={1.2} aria-hidden />
                <h3 className="mt-6 font-display text-xl tracking-[0.04em] text-bone uppercase">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{p.body}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
