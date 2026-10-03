"use client";

import { motion, useReducedMotion } from "framer-motion";

/* Deterministic pseudo-random so server and client render identically. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface Candle {
  x: number;
  open: number;
  close: number;
  high: number;
  low: number;
}

function buildCandles(count: number, width: number, height: number): Candle[] {
  const rand = seeded(42);
  const candles: Candle[] = [];
  let price = height * 0.72;
  const step = width / count;
  for (let i = 0; i < count; i++) {
    const drift = -height * 0.012; // gentle up-trend (y axis inverted)
    const move = (rand() - 0.45) * height * 0.07 + drift;
    const open = price;
    const close = Math.min(height * 0.9, Math.max(height * 0.12, price + move));
    const high = Math.min(open, close) - rand() * height * 0.035;
    const low = Math.max(open, close) + rand() * height * 0.035;
    candles.push({ x: i * step + step / 2, open, close, high, low });
    price = close;
  }
  return candles;
}

const W = 560;
const H = 360;
const candles = buildCandles(34, W, H);
const linePath = candles
  .map((c, i) => `${i ? "L" : "M"}${c.x.toFixed(1)},${((c.open + c.close) / 2).toFixed(1)}`)
  .join(" ");
const last = candles[candles.length - 1];

/**
 * Decorative hero visual: an abstract trading-terminal panel.
 * Purely illustrative — it does not depict real prices.
 */
export function HeroVisual() {
  const reduce = useReducedMotion();
  const candleWidth = (W / candles.length) * 0.46;

  return (
    <div className="relative" aria-hidden>
      {/* Orbit rings */}
      <div className="absolute top-1/2 left-1/2 -z-10 size-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
      <div className="absolute top-1/2 left-1/2 -z-10 size-[95%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/[0.08]" />
      <div className="absolute top-1/2 left-1/2 -z-10 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.08] blur-[90px]" />

      <motion.div
        className="glass relative overflow-hidden rounded-[1.75rem] bg-charcoal/40 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]"
        initial={reduce ? false : { opacity: 0, y: 30, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformPerspective: 1200 }}
      >
        <div className="hairline-gold absolute inset-x-12 top-0" />
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex gap-1.5">
              <span className="size-1.5 rounded-full bg-white/15" />
              <span className="size-1.5 rounded-full bg-white/15" />
              <span className="size-1.5 rounded-full bg-gold/60" />
            </span>
            <span className="text-[0.625rem] tracking-[0.24em] text-mist uppercase">XAU / USD · H4</span>
          </div>
          <span className="text-[0.5625rem] tracking-[0.2em] text-faint uppercase">Illustrative</span>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
          <defs>
            <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c9a961" stopOpacity="0.22" />
              <stop offset="1" stopColor="#c9a961" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#8f7438" />
              <stop offset="0.6" stopColor="#e8d5a3" />
              <stop offset="1" stopColor="#c9a961" />
            </linearGradient>
          </defs>

          {/* grid */}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`h${i}`} x1="0" x2={W} y1={(H / 6) * i} y2={(H / 6) * i} stroke="rgba(255,255,255,0.045)" />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} y1="0" y2={H} x1={(W / 8) * i} x2={(W / 8) * i} stroke="rgba(255,255,255,0.03)" />
          ))}

          {/* candles */}
          {candles.map((c, i) => {
            const up = c.close < c.open;
            const top = Math.min(c.open, c.close);
            const h = Math.max(1.5, Math.abs(c.close - c.open));
            return (
              <motion.g
                key={i}
                initial={reduce ? false : { opacity: 0, scaleY: 0.2 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: `${c.x}px ${(c.open + c.close) / 2}px` }}
              >
                <line x1={c.x} x2={c.x} y1={c.high} y2={c.low} stroke={up ? "rgba(232,213,163,0.45)" : "rgba(255,255,255,0.18)"} />
                <rect
                  x={c.x - candleWidth / 2}
                  y={top}
                  width={candleWidth}
                  height={h}
                  rx="1"
                  fill={up ? "rgba(201,169,97,0.55)" : "rgba(255,255,255,0.08)"}
                  stroke={up ? "rgba(232,213,163,0.6)" : "rgba(255,255,255,0.22)"}
                  strokeWidth="0.6"
                />
              </motion.g>
            );
          })}

          {/* trend line + area */}
          <motion.path
            d={`${linePath} L${last.x},${H} L${candles[0].x},${H} Z`}
            fill="url(#hero-area)"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.6 }}
          />
          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#hero-line)"
            strokeWidth="1.6"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.4, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* level line */}
          <line x1="0" x2={W} y1={(last.open + last.close) / 2} y2={(last.open + last.close) / 2} stroke="rgba(201,169,97,0.35)" strokeDasharray="3 5" />
          <motion.circle
            cx={last.x}
            cy={(last.open + last.close) / 2}
            r="4"
            fill="#e8d5a3"
            initial={reduce ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 3.1, duration: 0.4 }}
          />
          {!reduce && (
            <motion.circle
              cx={last.x}
              cy={(last.open + last.close) / 2}
              r="4"
              fill="none"
              stroke="#e8d5a3"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 3.2, ease: "easeOut" }}
              style={{ transformOrigin: `${last.x}px ${(last.open + last.close) / 2}px` }}
            />
          )}
        </svg>

        <div className="grid grid-cols-3 border-t border-line text-[0.5625rem] tracking-[0.2em] uppercase">
          {[
            ["Structure", "Higher lows"],
            ["Execution", "Planned"],
            ["Risk", "Defined"],
          ].map(([k, v]) => (
            <div key={k} className="border-r border-line px-4 py-3 last:border-r-0">
              <p className="text-faint">{k}</p>
              <p className="mt-1 text-mist">{v}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* floating chips */}
      <motion.div
        className="glass absolute -bottom-16 left-6 hidden rounded-2xl bg-charcoal/80 px-4 py-3 sm:block lg:-left-8"
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.8 }}
      >
        <p className="text-[0.5625rem] tracking-[0.22em] text-faint uppercase">Risk per idea</p>
        <p className="mt-1 font-display text-lg text-bone">Defined first</p>
      </motion.div>
      <motion.div
        className="glass absolute -top-16 right-6 hidden rounded-2xl bg-charcoal/80 px-4 py-3 sm:block lg:-right-6"
        initial={reduce ? false : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.1 }}
      >
        <p className="text-[0.5625rem] tracking-[0.22em] text-faint uppercase">Focus</p>
        <p className="mt-1 font-display text-lg text-gold-light">XAU · BTC</p>
      </motion.div>
    </div>
  );
}
