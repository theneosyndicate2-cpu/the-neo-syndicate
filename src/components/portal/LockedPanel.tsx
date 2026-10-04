import { Lock } from "lucide-react";
import { tierLabel } from "@/lib/tiers";
import { ButtonLink } from "@/components/ui/Button";

/** Shown in place of content the member's tier doesn't unlock yet. */
export function LockedPanel({ requiredTier, title, body }: { requiredTier: string; title: string; body: string }) {
  return (
    <div className="hud relative overflow-hidden rounded-3xl border border-line bg-charcoal p-8 text-center sm:p-12">
      <div aria-hidden className="pointer-events-none absolute inset-0 dot-bg opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />
      <span className="relative mx-auto grid size-14 place-items-center rounded-xl border border-gold/40 bg-gold/[0.06] text-gold">
        <Lock className="size-6" strokeWidth={1.4} aria-hidden />
      </span>
      <p className="eyebrow relative mt-6">{tierLabel(requiredTier)} tier required</p>
      <h2 className="relative mt-3 font-display text-2xl font-light text-bone">{title}</h2>
      <p className="relative mx-auto mt-3 max-w-md text-sm leading-relaxed text-mist">{body}</p>
      <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/invest#apply" icon>
          Apply for membership
        </ButtonLink>
        <ButtonLink href="/community" variant="secondary">
          Join the community
        </ButtonLink>
      </div>
    </div>
  );
}
