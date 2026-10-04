import { BookOpen, Landmark, LineChart, MessagesSquare, Radio } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/sections/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { SocialLinks } from "@/components/sections/SocialLinks";
import { RiskDisclosure } from "@/components/sections/RiskDisclosure";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = pageMetadata({
  title: "Community — The Syndicate Trading Community",
  description:
    "Join The Neo Syndicate trading community: elite XAUUSD and BTCUSD trades, market discussions, trading insights, live sessions and investment opportunities.",
  path: "/community",
});

const features = [
  {
    icon: LineChart,
    title: "Elite Trades",
    body: "Structured setups with entry, stop loss and staged targets — shared with context, not just levels.",
  },
  {
    icon: MessagesSquare,
    title: "Market Discussions",
    body: "Focused conversation on gold, Bitcoin and the macro backdrop. Signal over noise, always.",
  },
  {
    icon: Landmark,
    title: "Investment Opportunities",
    body: "First notice of new investment pools and private-capital availability for qualified members.",
  },
  {
    icon: BookOpen,
    title: "Trading Insights",
    body: "Breakdowns of what worked, what didn't and why — so every member sharpens their own process.",
  },
  {
    icon: Radio,
    title: "Live Sessions",
    body: "Live market walkthroughs around key sessions and high-impact events, with Q&A from the desk.",
  },
];

export default function CommunityPage() {
  return (
    <>
      <PageHero
        eyebrow="The Syndicate community"
        title={
          <>
            Where disciplined traders <span className="text-accent">convene.</span>
          </>
        }
        description="A private community for traders and investors who value process, conviction and long-term thinking."
      >
        <SocialLinks variant="buttons" />
      </PageHero>

      <section aria-labelledby="inside-heading" className="pb-24 sm:pb-32">
        <div className="container-luxe">
          <SectionHeading eyebrow="Inside the Syndicate" title={<span id="inside-heading">What members receive.</span>} />
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal
                key={f.title}
                delay={(i % 3) * 0.08}
                className={cn(
                  i === 0
                    ? "group bg-gradient-to-br from-gold/[0.07] to-charcoal p-7 sm:col-span-2 sm:p-9 lg:col-span-1 lg:row-span-2"
                    : "group bg-charcoal p-7 transition-colors duration-700 hover:bg-graphite sm:p-9",
                )}
              >
                <f.icon className="size-7 text-gold" strokeWidth={1.2} aria-hidden />
                <h3 className={i === 0 ? "mt-10 font-display text-3xl font-light text-bone sm:mt-24" : "mt-8 font-display text-xl text-bone"}>
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{f.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="channels-heading" className="relative bg-night py-24 sm:py-28">
        <div aria-hidden className="hairline-gold absolute inset-x-0 top-0 opacity-30" />
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Channels"
            title={<span id="channels-heading">Choose where you follow.</span>}
            description="Telegram is home to the core community. TikTok and Instagram carry public market breakdowns and announcements."
          />
          <Reveal delay={0.1}>
            <SocialLinks variant="cards" className="mt-14" />
          </Reveal>
          <Reveal className="mt-10">
            <RiskDisclosure variant="inline" text="Beware of impersonators — we will never DM you first asking for funds, passwords or seed phrases." />
          </Reveal>
        </div>
      </section>

      <CTASection
        title={
          <>
            Your seat <span className="text-gold-gradient">is waiting.</span>
          </>
        }
        primary={{ href: "/invest#apply", label: "Enter the Syndicate" }}
        secondary={{ href: "/contact", label: "Contact the desk" }}
      />
    </>
  );
}
