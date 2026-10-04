import { cn } from "@/lib/utils";

/** Monogram mark: a faceted "N" inside a hairline diamond. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-8", className)} aria-hidden>
      <defs>
        <linearGradient id="ns-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3e6c4" />
          <stop offset="0.45" stopColor="#c9a961" />
          <stop offset="1" stopColor="#8f7438" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="28" height="28" transform="rotate(45 20 20)" fill="none" stroke="url(#ns-gold)" strokeWidth="1" />
      <path d="M14 27V13l12 14V13" fill="none" stroke="url(#ns-gold)" strokeWidth="1.6" strokeLinejoin="miter" />
    </svg>
  );
}

export function Wordmark({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex shrink-0 items-center gap-3 whitespace-nowrap", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="text-[0.5rem] tracking-[0.5em] text-gold uppercase">The</span>
        <span className={cn("mt-1 font-display text-[0.8125rem] font-medium tracking-[0.34em] text-bone uppercase", compact && "text-xs")}>
          Neo Syndicate
        </span>
      </span>
    </span>
  );
}
