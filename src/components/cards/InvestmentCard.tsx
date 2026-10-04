import { Check } from "lucide-react";
import type { InvestmentPool } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";

const statusTone: Record<InvestmentPool["status"], string> = {
  OPEN: "border-up/40 text-up",
  FILLING: "border-gold/40 text-gold-light",
  CLOSED: "border-line-strong text-muted",
  "BY APPLICATION": "border-line-strong text-mist",
};

const riskBars: Record<InvestmentPool["riskLevel"], number> = { Moderate: 2, High: 3, "Very High": 4 };

interface InvestmentCardProps {
  pool: InvestmentPool;
  variant?: "summary" | "full";
  featured?: boolean;
  className?: string;
}

export function InvestmentCard({ pool, variant = "full", featured, className }: InvestmentCardProps) {
  return (
    <article
      className={cn(
        "hud group relative flex flex-col overflow-hidden rounded-3xl border p-7 transition-all duration-700 hover:-translate-y-1 sm:p-8",
        featured
          ? "border-gold/40 bg-gradient-to-b from-gold/[0.08] via-charcoal to-charcoal shadow-[0_40px_100px_-50px_rgba(212,175,95,0.5)]"
          : "hud-cyan border-line bg-charcoal hover:border-cyan/30",
        className,
      )}
      data-spotlight
    >
      {featured && <div aria-hidden className="hairline-gold absolute inset-x-0 top-0" />}
      <header className="flex min-h-10 items-start justify-between gap-3">
        <p className="eyebrow">{pool.tagline}</p>
        <span
          className={cn(
            "rounded-sm font-mono border px-2.5 py-0.5 text-[0.5625rem] font-medium tracking-[0.2em] whitespace-nowrap uppercase",
            statusTone[pool.status],
          )}
        >
          {pool.status}
        </span>
      </header>

      <h3 className="mt-5 font-display text-2xl font-light tracking-tight text-bone sm:text-[1.75rem]">{pool.name}</h3>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-xs tracking-[0.16em] text-muted uppercase">From</span>
        <span className="tabular font-display text-4xl font-light text-gold-gradient">
          {formatCurrency(pool.minimum, pool.currency)}
        </span>
        {pool.id !== "custom-capital" && <span className="text-sm text-gold/80">+</span>}
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-line py-5 text-sm">
        <div>
          <dt className="label-mono">Duration</dt>
          <dd className="mt-1 text-bone">{pool.duration}</dd>
        </div>
        <div>
          <dt className="label-mono">Risk level</dt>
          <dd className="mt-1.5 flex items-center gap-2 text-bone">
            <span className="flex gap-0.5" aria-hidden>
              {[1, 2, 3, 4].map((n) => (
                <span key={n} className={cn("h-2.5 w-1 rounded-full", n <= riskBars[pool.riskLevel] ? "bg-gold" : "bg-steel")} />
              ))}
            </span>
            {pool.riskLevel}
          </dd>
        </div>
        {variant === "full" && (
          <div className="col-span-2">
            <dt className="label-mono">Markets</dt>
            <dd className="mt-1 text-bone">{pool.markets.join(" · ")}</dd>
          </div>
        )}
      </dl>

      <p className="mt-5 text-sm leading-relaxed text-mist">{pool.strategy}</p>

      {variant === "full" && (
        <ul className="mt-5 space-y-2.5">
          {pool.highlights.map((h) => (
            <li key={h} className="flex items-center gap-3 text-sm text-mist">
              <Check className="size-3.5 text-gold" aria-hidden />
              {h}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto pt-8">
        <ButtonLink
          href={`/invest?pool=${pool.id}#apply`}
          variant={featured ? "primary" : "secondary"}
          className="w-full"
          icon
          aria-label={`Apply for the ${pool.name}`}
        >
          {pool.status === "BY APPLICATION" ? "Request access" : "Apply"}
        </ButtonLink>
      </div>
    </article>
  );
}
