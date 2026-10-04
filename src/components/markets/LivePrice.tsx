"use client";

import { useEffect, useRef, useState } from "react";
import { cn, formatNumber } from "@/lib/utils";

/** Price that briefly flashes green/red when it ticks up/down. */
export function LivePrice({ value, decimals, className }: { value: number; decimals: number; className?: string }) {
  const prev = useRef(value);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (value === prev.current) return;
    setFlash(value > prev.current ? "up" : "down");
    prev.current = value;
    const t = window.setTimeout(() => setFlash(null), 700);
    return () => window.clearTimeout(t);
  }, [value]);

  return (
    <span
      className={cn(
        "transition-[color,text-shadow] duration-700",
        flash === "up" && "text-up [text-shadow:0_0_18px_rgba(63,224,176,0.6)] duration-75",
        flash === "down" && "text-down [text-shadow:0_0_18px_rgba(255,111,106,0.6)] duration-75",
        className,
      )}
    >
      {formatNumber(value, decimals)}
    </span>
  );
}
