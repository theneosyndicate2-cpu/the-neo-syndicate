import { Crown } from "lucide-react";
import { tierLabel, tierRank } from "@/lib/tiers";
import { cn } from "@/lib/utils";

export function TierBadge({ tier, className }: { tier: string; className?: string }) {
  const rank = tierRank(tier);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.16em] uppercase",
        rank === 0 ? "border-line-strong text-mist" : rank === 1 ? "border-cyan/40 text-cyan-light" : "border-gold/50 text-gold-light",
        className,
      )}
    >
      {rank >= 2 && <Crown className="size-3" aria-hidden />}
      {tierLabel(tier)}
    </span>
  );
}
