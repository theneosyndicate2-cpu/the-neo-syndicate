"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const GLYPHS = "▓▒░█<>/\\[]{}=+*#%01ABCDEFXZ";

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** ms before the decode starts */
  delay?: number;
  /** total decode duration in ms */
  duration?: number;
}

/**
 * "Decrypt" effect: characters resolve left→right from random glyphs.
 * Server-renders the final text (SEO + no-JS safe); the visual effect is
 * hidden from assistive tech, which reads the real text via a sr-only copy.
 */
export function ScrambleText({ text, className, delay = 0, duration = 900 }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    let start = 0;
    const timer = window.setTimeout(() => {
      const tick = (t: number) => {
        if (!start) start = t;
        const progress = Math.min(1, (t - start) / duration);
        const resolved = Math.floor(progress * text.length);
        setDisplay(
          text
            .split("")
            .map((ch, i) => (i < resolved || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
            .join(""),
        );
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [inView, reduce, text, delay, duration]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{display}</span>
    </span>
  );
}
