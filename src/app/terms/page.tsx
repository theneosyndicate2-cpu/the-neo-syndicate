import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: "The terms governing use of The Neo Syndicate website, community and content.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Terms of Use" updated="4 October 2026">
      <h2>1. Acceptance</h2>
      <p>
        By accessing this website or any {siteConfig.name} community channel, you agree to these terms. If you do not
        agree, please do not use the website or services.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years old and legally able to enter into binding agreements in your jurisdiction. Some
        services may not be available in certain countries. [Placeholder — list restricted jurisdictions.]
      </p>

      <h2>3. Informational content only</h2>
      <p>
        All trade ideas, signals, analysis and other content are for informational and educational purposes only and
        are not financial advice. You are solely responsible for your own trading and investment decisions. Please read
        our <Link href="/risk-disclosure">Risk Disclosure</Link>.
      </p>

      <h2>4. Applications and investment pools</h2>
      <p>
        Submitting an application through this website does not create any investment, payment obligation or
        contractual relationship. Any participation in an investment pool would be governed by separate written terms,
        subject to eligibility and suitability checks and all applicable laws.
      </p>

      <h2>5. Membership and community conduct</h2>
      <ul>
        <li>Do not share, resell or redistribute member-only content without permission.</li>
        <li>Do not impersonate {siteConfig.name} staff or solicit funds from other members.</li>
        <li>Treat other members with respect; abusive or misleading conduct may result in removal.</li>
      </ul>

      <h2>6. Intellectual property</h2>
      <p>
        The {siteConfig.name} name, logo, design and content are owned by or licensed to us and may not be used without
        prior written consent.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {siteConfig.name} is not liable for any loss or damage arising from
        reliance on content, trading or investment decisions, or use of this website. [Placeholder — legal counsel to
        finalise wording consistent with applicable consumer law.]
      </p>

      <h2>8. Third-party links</h2>
      <p>
        This website links to third-party platforms such as Telegram, TikTok and Instagram. We are not responsible for
        their content or practices.
      </p>

      <h2>9. Changes and governing law</h2>
      <p>
        We may update these terms at any time. [Placeholder — insert governing law and jurisdiction, e.g. England and
        Wales.]
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about these terms can be sent to <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>
    </LegalPage>
  );
}
