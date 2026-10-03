import { ArrowUpRight } from "lucide-react";
import { communityLinks } from "@/data/communityLinks";
import { cn } from "@/lib/utils";
import { SocialIcon } from "@/components/ui/SocialIcon";

interface SocialLinksProps {
  variant?: "icons" | "buttons" | "cards";
  className?: string;
}

export function SocialLinks({ variant = "icons", className }: SocialLinksProps) {
  if (variant === "icons") {
    return (
      <ul className={cn("flex items-center gap-2", className)}>
        {communityLinks.map((link) => (
          <li key={link.platform}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`The Neo Syndicate on ${link.label}`}
              className="grid size-10 place-items-center rounded-full border border-line text-mist transition-all duration-500 hover:border-gold/50 hover:text-gold-light"
            >
              <SocialIcon platform={link.platform} />
            </a>
          </li>
        ))}
      </ul>
    );
  }

  if (variant === "buttons") {
    return (
      <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap", className)}>
        {communityLinks.map((link, i) => (
          <a
            key={link.platform}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group inline-flex h-12 items-center justify-center gap-3 rounded-full px-6 text-[0.6875rem] font-medium tracking-[0.2em] uppercase transition-all duration-500",
              i === 0
                ? "bg-gradient-to-b from-gold-light via-gold to-gold-deep text-ink hover:-translate-y-0.5"
                : "border border-line-strong text-bone hover:border-gold/60 hover:text-gold-light",
            )}
          >
            <SocialIcon platform={link.platform} />
            {link.cta}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3", className)}>
      {communityLinks.map((link) => (
        <a
          key={link.platform}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col gap-10 bg-charcoal p-7 transition-colors duration-500 hover:bg-graphite sm:p-9"
        >
          <div className="flex items-start justify-between">
            <span className="grid size-12 place-items-center rounded-2xl border border-line text-gold transition-colors duration-500 group-hover:border-gold/50">
              <SocialIcon platform={link.platform} className="size-5" />
            </span>
            <ArrowUpRight className="size-5 text-faint transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-light" />
          </div>
          <div>
            <p className="font-display text-xl text-bone">{link.label}</p>
            <p className="mt-1 text-sm text-muted">{link.handle}</p>
            <p className="mt-4 text-sm leading-relaxed text-mist">{link.description}</p>
            <p className="mt-6 text-[0.6875rem] tracking-[0.22em] text-gold uppercase">{link.cta}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
