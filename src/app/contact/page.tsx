import { Clock, Mail, ShieldCheck } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { PageHero } from "@/components/sections/PageHero";
import { SocialLinks } from "@/components/sections/SocialLinks";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = pageMetadata({
  title: "Contact the Desk",
  description:
    "Contact The Neo Syndicate about membership, investment pools, elite trades, partnerships or media enquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Speak with <span className="text-accent">the desk.</span>
          </>
        }
        description="Questions about membership, investment pools or partnerships — we read every message."
      />

      <section className="pb-24 sm:pb-32">
        <div className="container-luxe grid gap-12 lg:grid-cols-12">
          <Reveal className="space-y-6 lg:col-span-4">
            {[
              { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
              { icon: Clock, label: "Response time", value: "Within two business days" },
              { icon: ShieldCheck, label: "Security", value: "We never ask for passwords, seed phrases or account access." },
            ].map((item) => (
              <div key={item.label} className="flex gap-4 rounded-3xl border border-line bg-charcoal p-6">
                <item.icon className="mt-0.5 size-5 shrink-0 text-gold" strokeWidth={1.3} aria-hidden />
                <div>
                  <p className="label-mono">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="mt-1.5 block text-sm break-all text-bone hover:text-gold-light">
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-1.5 text-sm text-bone">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
            <div className="rounded-3xl border border-line bg-charcoal p-6">
              <p className="label-mono">Follow</p>
              <SocialLinks className="mt-4" />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-8">
            <div className="glass relative rounded-3xl bg-charcoal/60 p-6 sm:p-10">
              <div aria-hidden className="hairline-gold absolute inset-x-12 top-0" />
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
