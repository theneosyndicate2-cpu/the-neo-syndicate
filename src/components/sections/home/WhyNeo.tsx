import { Compass, Eye, Gauge, ShieldCheck, Target, Users } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const principles = [
  { icon: Target, title: "Discipline", body: "A defined process for every position. No improvisation, no revenge trading, no chasing." },
  { icon: Compass, title: "Strategy", body: "Ideas are built from structure, liquidity and macro context — not from noise or hype." },
  { icon: ShieldCheck, title: "Risk awareness", body: "Risk is set before entry. Losses are part of the business and are planned for, not hidden." },
  { icon: Gauge, title: "Execution", body: "Precise entries, predefined invalidation and staged targets. The plan is the trade." },
  { icon: Eye, title: "Transparency", body: "Wins and losses are logged alike. Demo and verified data are always labelled as such." },
  { icon: Users, title: "Community", body: "A focused circle of members who value conviction, patience and long-term thinking." },
];

export function WhyNeo() {
  return (
    <section aria-labelledby="why-heading" className="relative py-24 sm:py-32">
      <div className="container-luxe grid gap-16 lg:grid-cols-12">
        <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
          <SectionHeading
            eyebrow="Why Neo Syndicate"
            title={
              <span id="why-heading">
                Built like a desk. <br className="hidden sm:block" />
                <span className="text-muted">Not a signal channel.</span>
              </span>
            }
            description="We don't sell certainty — markets don't offer it. What we offer is a disciplined framework, honest reporting and a community that treats trading as a profession."
          />
        </div>

        <ol className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:col-span-7">
          {principles.map((p, i) => (
            <Reveal as="li" key={p.title} delay={(i % 2) * 0.08} className="group relative bg-ink p-7 transition-colors duration-700 hover:bg-charcoal sm:p-8">
              <div className="flex items-center gap-4">
                <span className="grid size-11 place-items-center rounded-lg border border-line text-gold transition-all duration-500 group-hover:border-cyan/50 group-hover:text-cyan-light group-hover:shadow-[0_0_20px_-6px_rgba(56,225,255,0.8)]">
                  <p.icon className="size-5" strokeWidth={1.3} aria-hidden />
                </span>
                <h3 className="font-display text-lg text-bone">{p.title}</h3>
                <span className="ml-auto font-mono text-[0.625rem] text-faint">0{i + 1}</span>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-mist">{p.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
