import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How The Neo Syndicate collects, uses and protects your personal information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="4 October 2026">
      <h2>1. Who we are</h2>
      <p>
        This policy explains how {siteConfig.name} (“we”, “us”) handles personal information collected through this
        website. [Placeholder — insert legal entity name, registered address and data-controller details.]
      </p>

      <h2>2. Information we collect</h2>
      <ul>
        <li>Details you provide in forms: name, email address, Telegram username, country, message content.</li>
        <li>Application details: indicative investment amount and preferred pool.</li>
        <li>Basic technical data: browser type, device information and pages visited, where analytics are enabled.</li>
      </ul>

      <h2>3. How we use it</h2>
      <ul>
        <li>To respond to enquiries and review applications.</li>
        <li>To communicate with you about membership and services you have asked about.</li>
        <li>To operate, secure and improve the website.</li>
        <li>To meet legal and regulatory obligations.</li>
      </ul>

      <h2>4. Lawful basis</h2>
      <p>
        [Placeholder — legal counsel to confirm lawful bases, e.g. consent, legitimate interests, steps prior to
        entering a contract and legal obligation, under UK GDPR / EU GDPR or other applicable law.]
      </p>

      <h2>5. Sharing</h2>
      <p>
        We do not sell your personal information. We may share it with service providers who help us operate the
        website and process enquiries (for example hosting, email and CRM providers), under appropriate agreements, or
        where required by law.
      </p>

      <h2>6. Retention</h2>
      <p>
        We keep personal information only for as long as necessary for the purposes above or as required by law.
        [Placeholder — insert retention periods.]
      </p>

      <h2>7. Your rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, delete or restrict the use of your personal
        information, to object to processing and to data portability. To exercise these rights, contact{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. You may also have the right to complain to a
        supervisory authority, such as the UK Information Commissioner’s Office.
      </p>

      <h2>8. Cookies</h2>
      <p>
        This website uses only cookies that are strictly necessary for it to function. If analytics or marketing
        cookies are added in future, this policy will be updated and consent requested where required.
      </p>

      <h2>9. Security</h2>
      <p>
        We use reasonable technical and organisational measures to protect personal information. We will never ask
        you for passwords, private keys or seed phrases.
      </p>

      <h2>10. Changes</h2>
      <p>We may update this policy from time to time. The “last updated” date above shows when it last changed.</p>
    </LegalPage>
  );
}
