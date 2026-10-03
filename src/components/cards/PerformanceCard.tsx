"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PerformanceSummary } from "@/lib/types";
import { cn, formatSigned } from "@/lib/utils";

/** Monthly result bars + cumulative line. Values are in R (risk units). */
export function PerformanceCard({ summary, className }: { summary: PerformanceSummary; className?: string }) {
  const reduce = useReducedMotion();
  const values = summary.history.map((h) => h.value);
  const maxAbs = Math.max(...values.map(Math.abs), 1);
  let running = 0;
  const cumulative = values.map((v) => (running += v));
  const total = cumulative[cumulative.length - 1] ?? 0;
  const isDemo = summary.source !== "live";

  return (
    <div className={cn("relative overflow-hidden rounded-3xl border border-line bg-charcoal p-6 sm:p-8", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[0.6875rem] tracking-[0.22em] text-muted uppercase">Historical performance</p>
          <p className="mt-3 flex items-baseline gap-2">
            <span className="tabular font-display text-4xl font-light text-bone">{formatSigned(total, 1, "R")}</span>
            <span className="text-xs text-faint">cumulative, 6 months</span>
          </p>
        </div>
        {isDemo && (
          <span className="rounded-full border border-gold/40 bg-gold/[0.06] px-3 py-1 text-[0.5625rem] tracking-[0.2em] text-gold-light uppercase">
            Illustrative · Demo data
          </span>
        )}
      </div>

      <div
        className="relative mt-10 grid h-52 grid-cols-6 items-center gap-3 sm:gap-5"
        role="img"
        aria-label={`Monthly results in R: ${summary.history.map((h) => `${h.label} ${formatSigned(h.value, 1)}`).join(", ")}${isDemo ? " (demo data)" : ""}`}
      >
        <div aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-line-strong" />
        {summary.history.map((h, i) => {
          const pct = (Math.abs(h.value) / maxAbs) * 50;
          const positive = h.value >= 0;
          return (
            <div key={h.label} className="relative flex h-full flex-col items-center">
              <div className="relative h-full w-full">
                <motion.div
                  className={cn(
                    "absolute inset-x-1 rounded-sm sm:inset-x-2",
                    positive ? "bottom-1/2 bg-gradient-to-t from-gold-deep to-gold-light" : "top-1/2 bg-gradient-to-b from-down/70 to-down/30",
                  )}
                  style={{ height: `${pct}%`, transformOrigin: positive ? "bottom" : "top" }}
                  initial={reduce ? false : { scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                />
                <span
                  className={cn(
                    "tabular absolute inset-x-0 text-center text-[0.625rem]",
                    positive ? "text-gold-light" : "text-down",
                  )}
                  style={positive ? { bottom: `calc(50% + ${pct}% + 6px)` } : { top: `calc(50% + ${pct}% + 6px)` }}
                >
                  {formatSigned(h.value, 1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-6 gap-3 sm:gap-5" aria-hidden>
        {summary.history.map((h) => (
          <span key={h.label} className="text-center text-[0.625rem] tracking-[0.18em] text-faint uppercase">
            {h.label}
          </span>
        ))}
      </div>
      <p className="mt-6 text-xs leading-relaxed text-faint">
        Results expressed in R (multiples of risk per trade).{" "}
        {isDemo && "Figures shown are placeholders for layout only and do not represent real or verified trading performance."}
      </p>
    </div>
  );
}
