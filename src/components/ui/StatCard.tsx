import { cn } from "@/lib/utils";
import { Counter } from "./Counter";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  caption?: string;
  className?: string;
}

export function StatCard({ label, value, prefix, suffix, decimals = 0, caption, className }: StatCardProps) {
  return (
    <div className={cn("relative flex flex-col justify-between gap-6 bg-charcoal p-6 sm:p-8", className)}>
      <p className="label-mono">{label}</p>
      <div>
        <Counter
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          className="tabular block font-display text-4xl font-light tracking-tight text-bone sm:text-5xl"
        />
        {caption && <p className="mt-2 text-xs text-faint">{caption}</p>}
      </div>
    </div>
  );
}
