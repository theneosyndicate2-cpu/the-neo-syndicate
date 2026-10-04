import { KeyRound, LockKeyhole, ShieldCheck, UserCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  { icon: KeyRound, title: "Request access", body: "Create an account and verify your email." },
  { icon: UserCheck, title: "Apply", body: "Tell the desk about your experience and goals." },
  { icon: ShieldCheck, title: "Approval", body: "Approved members unlock elite trades and pools." },
];

/** Shown to visitors who aren't signed in — the rest of the site is members-only. */
export function PrivateAccess() {
  return (
    <section aria-labelledby="access-heading" className="relative bg-night py-24 sm:py-32">
      <div aria-hidden className="hairline-gold absolute inset-x-0 top-0 opacity-30" />
      <div className="container-luxe grid gap-14 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Private access"
            title={
              <span id="access-heading">
                Members only. <span className="text-accent">By design.</span>
              </span>
            }
            description="The desk, the trade log, market intelligence and investment pools are reserved for members of The Neo Syndicate."
          />
          <Reveal delay={0.1} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/signup" size="lg" icon>
              Request access
            </ButtonLink>
            <ButtonLink href="/login" size="lg" variant="secondary">
              Sign in
            </ButtonLink>
          </Reveal>
        </div>

        <ol className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3 lg:col-span-7">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.08} className="relative bg-charcoal p-7 sm:p-8">
              <div className="flex items-center justify-between">
                <s.icon className="size-6 text-gold" strokeWidth={1.3} aria-hidden />
                <span className="font-mono text-[0.625rem] tracking-[0.2em] text-faint">0{i + 1}</span>
              </div>
              <h3 className="mt-8 font-display text-xl text-bone">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
      <div className="container-luxe mt-16 flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.12em] text-muted uppercase">
        <LockKeyhole className="size-4 text-cyan" aria-hidden />
        Content is visible to signed-in members only
      </div>
    </section>
  );
}
