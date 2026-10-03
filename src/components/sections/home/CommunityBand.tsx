import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLinks } from "@/components/sections/SocialLinks";

export function CommunityBand() {
  return (
    <section aria-labelledby="community-heading" className="relative py-24 sm:py-32">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="Community"
          title={<span id="community-heading">A private circle of disciplined traders.</span>}
          description="Market discussion, desk updates, live sessions and elite trades — shared inside a community that values process over noise."
        />
        <Reveal delay={0.1}>
          <SocialLinks variant="buttons" className="mt-10" />
        </Reveal>
        <Reveal delay={0.15}>
          <SocialLinks variant="cards" className="mt-14" />
        </Reveal>
      </div>
    </section>
  );
}
