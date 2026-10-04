import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = pageMetadata({
  title: "The Syndicate — Our Philosophy & Trading Approach",
  description:
    "Inside The Neo Syndicate: a disciplined trading and investment community focused on XAUUSD and BTCUSD, built on risk awareness, execution and long-term capital thinking.",
  path: "/syndicate",
});

const chapters = [
  {
    id: "what",
    label: "What is Neo Syndicate?",
    title: "A private ecosystem for serious market participants.",
    body: [
      "The Neo Syndicate is a trading and investment community built around one idea: that consistent participation in markets is a craft, not a lottery ticket. We focus primarily on gold (XAUUSD) and Bitcoin (BTCUSD) — two of the most liquid, most macro-sensitive instruments in the world.",
      "Members gain access to structured trade ideas, market intelligence, live sessions and — for those who qualify — selected investment pools. Everything we publish follows the same standard: a clear thesis, a defined risk and an honest record of the outcome.",
    ],
  },
  {
    id: "philosophy",
    label: "Our philosophy",
    title: "Capital. Strategy. Execution. In that order.",
    body: [
      "Capital is protected first. Strategy decides where and why we participate. Execution is the discipline to follow the plan when it matters. Remove any one of the three and the edge disappears.",
      "We are deliberately unexciting about how we talk about results. Markets are uncertain; anyone who promises otherwise is selling something. Our job is to put the odds on our side as often as possible, and to manage the times when they are not.",
    ],
  },
  {
    id: "approach",
    label: "Trading approach",
    title: "Structure, liquidity and context.",
    body: [
      "Our analysis combines higher-timeframe market structure, liquidity behaviour around key levels and the macroeconomic backdrop — the dollar, real yields, risk sentiment and the event calendar.",
      "Every idea is published with an entry zone, a stop loss that defines the invalidation and staged take-profit targets. If we can't define where we are wrong, we don't take the trade.",
    ],
  },
  {
    id: "capital",
    label: "Capital mindset",
    title: "Think in risk units, not in screenshots.",
    body: [
      "We measure outcomes in R — multiples of the risk taken — rather than in headline percentages or account screenshots. It keeps performance comparable, honest and independent of account size.",
      "Long-term capital growth comes from compounding small, controlled edges over many trades. It does not come from oversized positions or doubling down after losses.",
    ],
  },
  {
    id: "community",
    label: "Community",
    title: "A circle, not a crowd.",
    body: [
      "The Syndicate is intentionally focused. We value members who ask good questions, respect risk and contribute to the quality of the room. Discussion is about process — what we saw, why we acted and what we learned.",
      "Live sessions, market breakdowns and the trade log are designed to make every member a better decision-maker, not a dependent follower.",
    ],
  },
  {
    id: "risk",
    label: "Risk discipline",
    title: "Losses are planned for. Never hidden.",
    body: [
      "Every trade can lose. We define risk per idea before entry, cap exposure across correlated positions and log losing trades with the same prominence as winning ones.",
      "Position sizing is personal. The desk shares the framework; every member sizes each idea to their own capital and owns the decision.",
    ],
  },
];

const neverList = ["Guaranteed profits", "Risk-free trading", "“Double your money”", "100% win rates", "Get-rich-quick schemes"];

export default function SyndicatePage() {
  return (
    <>
      <PageHero
        eyebrow="The Syndicate"
        title={
          <>
            Discipline is the <span className="text-accent">edge.</span>
          </>
        }
        description="The Neo Syndicate exists for traders and investors who want a serious, process-driven approach to the markets — and a community that holds the same standard."
      />

      <section className="relative pb-24 sm:pb-32">
        <div className="container-luxe grid gap-14 lg:grid-cols-12">
          <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
            <ol className="sticky top-32 space-y-1 border-l border-line">
              {chapters.map((c, i) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    className="-ml-px flex items-center gap-3 border-l border-transparent py-2 pl-5 text-xs tracking-[0.14em] text-muted uppercase transition-colors hover:border-gold hover:text-bone"
                  >
                    <span className="tabular text-faint">0{i + 1}</span>
                    {c.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-20 sm:space-y-28 lg:col-span-9">
            {chapters.map((c, i) => (
              <article key={c.id} id={c.id} className="scroll-mt-32">
                <Reveal>
                  <p className="eyebrow">
                    <span className="tabular mr-3 text-faint">0{i + 1}</span>
                    {c.label}
                  </p>
                  <h2 className="mt-5 max-w-3xl font-display text-3xl leading-tight font-light tracking-[-0.02em] text-bone sm:text-[2.75rem]">
                    {c.title}
                  </h2>
                  <div className="mt-7 grid gap-5 text-base leading-[1.85] text-mist md:grid-cols-2 md:gap-10">
                    {c.body.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="never-heading" className="relative bg-night py-24 sm:py-28">
        <div aria-hidden className="hairline-gold absolute inset-x-0 top-0 opacity-30" />
        <div className="container-luxe grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="What we will never promise"
            title={<span id="never-heading">Credibility is built by what you refuse to say.</span>}
            description="If you see any of these claims attached to our name, it isn't us."
          />
          <Reveal delay={0.1}>
            <ul className="divide-y divide-line rounded-3xl border border-line bg-charcoal">
              {neverList.map((item) => (
                <li key={item} className="flex items-center justify-between px-6 py-5 sm:px-8">
                  <span className="font-display text-lg text-mist line-through decoration-gold/60 decoration-1">{item}</span>
                  <span className="label-mono">Never</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <CTASection
        title={
          <>
            Built for the <span className="text-gold-gradient">long game.</span>
          </>
        }
        description="If our standard matches yours, we'd like to hear from you."
        primary={{ href: "/invest#apply", label: "Join the Syndicate" }}
        secondary={{ href: "/community", label: "Explore the community" }}
      />
    </>
  );
}
