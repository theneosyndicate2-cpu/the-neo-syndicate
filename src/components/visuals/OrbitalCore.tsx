"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { DataSource, MarketQuote } from "@/lib/types";
import { cn, formatNumber, formatSigned } from "@/lib/utils";

const C = 300; // viewBox centre
const NODE_R = 132;

/** Angle (deg) of each instrument node on the inner orbit, and where its readout panel sits. */
const layout = [
  { angle: -90, panel: { x: 468, y: 64 }, align: "left" as const },
  { angle: 30, panel: { x: 500, y: 468 }, align: "left" as const },
  { angle: 150, panel: { x: 100, y: 436 }, align: "right" as const },
];

const polar = (deg: number, r: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: C + r * Math.cos(rad), y: C + r * Math.sin(rad) };
};

const ticks = Array.from({ length: 90 }, (_, i) => {
  const a = i * 4;
  const long = i % 5 === 0;
  const p1 = polar(a, 236);
  const p2 = polar(a, long ? 222 : 229);
  return { ...p1, x2: p2.x, y2: p2.y, long };
});

const spin = (cls: string) => ({ className: cls, style: { transformBox: "view-box" as const, transformOrigin: "50% 50%" } });

/**
 * The hero's "reactor core": concentric instrument rings orbiting the Syndicate mark,
 * with readouts for each tracked market. Decorative; real values are labelled by source.
 */
export function OrbitalCore({ quotes, source }: { quotes: MarketQuote[]; source: DataSource }) {
  const reduce = useReducedMotion();
  const isLive = source === "live";

  return (
    <motion.div
      className="relative mx-auto aspect-square w-full max-w-[36rem]"
      initial={reduce ? false : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden
    >
      {/* glow + radar sweep */}
      <div className="absolute inset-[18%] rounded-full bg-cyan/[0.07] blur-3xl" />
      <div className="absolute inset-[30%] rounded-full bg-gold/[0.12] blur-3xl" />
      <div className="animate-spin-fast absolute inset-[12%] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(56,225,255,0.16)_40deg,transparent_70deg)] [mask-image:radial-gradient(circle,black_55%,transparent_71%)]" />

      <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id="oc-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbefcd" />
            <stop offset="0.5" stopColor="#d4af5f" />
            <stop offset="1" stopColor="#8f7438" />
          </linearGradient>
          <radialGradient id="oc-core" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#d4af5f" stopOpacity="0.35" />
            <stop offset="1" stopColor="#d4af5f" stopOpacity="0" />
          </radialGradient>
          <path id="oc-orbit" d={`M ${C} ${C - 188} a 188 188 0 1 1 -0.01 0`} />
        </defs>

        {/* crosshair */}
        <g stroke="rgba(140,210,255,0.08)">
          <line x1="0" y1={C} x2="600" y2={C} />
          <line x1={C} y1="0" x2={C} y2="600" />
        </g>

        {/* outer dashed ring */}
        <g {...spin("animate-spin-slower")}>
          <circle cx={C} cy={C} r="284" fill="none" stroke="rgba(140,210,255,0.16)" strokeDasharray="2 10" />
          <circle cx={C} cy={C} r="270" fill="none" stroke="rgba(212,175,95,0.25)" strokeDasharray="80 600" strokeWidth="1.5" />
        </g>

        {/* tick ring */}
        <g {...spin("animate-spin-rev")}>
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x}
              y1={t.y}
              x2={t.x2}
              y2={t.y2}
              stroke={t.long ? "rgba(212,175,95,0.55)" : "rgba(140,210,255,0.22)"}
              strokeWidth={t.long ? 1.2 : 0.8}
            />
          ))}
        </g>

        {/* data orbit with cyan arcs */}
        <circle cx={C} cy={C} r="188" fill="none" stroke="rgba(140,210,255,0.12)" />
        <g {...spin("animate-spin-slow")}>
          <circle cx={C} cy={C} r="188" fill="none" stroke="#38e1ff" strokeOpacity="0.85" strokeWidth="2" strokeDasharray="120 1061" strokeLinecap="round" />
          <circle cx={C} cy={C} r="188" fill="none" stroke="#38e1ff" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="30 1151" strokeDashoffset="-520" />
        </g>
        {!reduce && (
          <circle r="3.5" fill="#a6f1ff">
            <animateMotion dur="9s" repeatCount="indefinite" rotate="auto">
              <mpath href="#oc-orbit" />
            </animateMotion>
          </circle>
        )}

        {/* instrument orbit */}
        <circle cx={C} cy={C} r={NODE_R} fill="none" stroke="url(#oc-gold)" strokeOpacity="0.6" />
        <circle cx={C} cy={C} r={NODE_R - 14} fill="none" stroke="rgba(140,210,255,0.1)" strokeDasharray="1 5" />

        {/* connectors + nodes */}
        {layout.map((l, i) => {
          const n = polar(l.angle, NODE_R);
          return (
            <g key={i}>
              <polyline
                points={`${n.x},${n.y} ${(n.x + l.panel.x) / 2},${l.panel.y} ${l.panel.x},${l.panel.y}`}
                fill="none"
                stroke="rgba(56,225,255,0.4)"
                strokeDasharray="3 4"
              />
              <circle cx={n.x} cy={n.y} r="12" fill="rgba(56,225,255,0.08)" stroke="rgba(56,225,255,0.5)" />
              <circle cx={n.x} cy={n.y} r="4" fill="#38e1ff" />
              {!reduce && (
                <circle cx={n.x} cy={n.y} r="4" fill="none" stroke="#38e1ff">
                  <animate attributeName="r" values="4;20" dur="2.4s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0" dur="2.4s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}

        {/* core */}
        <circle cx={C} cy={C} r="96" fill="url(#oc-core)" />
        <circle cx={C} cy={C} r="70" fill="rgba(3,4,5,0.85)" stroke="rgba(212,175,95,0.35)" />
        <g {...spin("animate-spin-slow")}>
          <circle cx={C} cy={C} r="80" fill="none" stroke="rgba(212,175,95,0.5)" strokeDasharray="1 7" />
        </g>
        <rect x={C - 34} y={C - 34} width="68" height="68" transform={`rotate(45 ${C} ${C})`} fill="none" stroke="url(#oc-gold)" strokeWidth="1.4" />
        <path d={`M ${C - 16} ${C + 20} V ${C - 20} L ${C + 16} ${C + 20} V ${C - 20}`} fill="none" stroke="url(#oc-gold)" strokeWidth="3" />
      </svg>

      {/* readout panels */}
      {quotes.slice(0, layout.length).map((q, i) => {
        const l = layout[i];
        const up = q.change > 0;
        return (
          <div
            key={q.symbol}
            className={cn(
              "glass hud hud-cyan absolute hidden min-w-[8.5rem] bg-ink/70 px-3 py-2 font-mono sm:block",
              l.align === "right" ? "-translate-x-full" : "",
              "-translate-y-1/2",
            )}
            style={{ left: `${(l.panel.x / 600) * 100}%`, top: `${(l.panel.y / 600) * 100}%` }}
          >
            <div className="flex items-center justify-between gap-3 text-[0.5625rem] tracking-[0.18em]">
              <span className="text-cyan">{q.symbol}</span>
              <span className={isLive ? "text-up" : "text-gold/80"}>{isLive ? "LIVE" : "DEMO"}</span>
            </div>
            <div className="tabular mt-1 flex items-baseline justify-between gap-3">
              <span className="text-sm text-bone">{formatNumber(q.price, q.decimals)}</span>
              <span className={cn("text-[0.625rem]", up ? "text-up" : "text-down")}>
                {up ? "▲" : "▼"}
                {formatSigned(q.changePercent, 2, "%")}
              </span>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
