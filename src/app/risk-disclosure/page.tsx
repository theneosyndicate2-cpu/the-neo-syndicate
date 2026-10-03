import { pageMetadata } from "@/lib/seo";
import { RISK_DISCLAIMER_FULL, siteConfig } from "@/lib/site";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata = pageMetadata({
  title: "Risk Disclosure",
  description:
    "Important risk disclosure for The Neo Syndicate: trading and investing involve substantial risk, including the possible loss of capital.",
  path: "/risk-disclosure",
});

export default function RiskDisclosurePage() {
  return (
    <LegalPage eyebrow="Legal" title="Risk Disclosure" updated="4 October 2026">
      <div className="rounded-2xl border border-line bg-charcoal p-6 sm:p-8">
        <p className="!text-base !text-bone">{RISK_DISCLAIMER_FULL}</p>
      </div>

      <h2>1. General risk warning</h2>
      <p>
        Trading foreign exchange, precious metals (including XAUUSD), cryptocurrencies (including BTCUSD), contracts
        for difference and other leveraged or volatile products carries a high level of risk and may not be suitable
        for all investors. You could lose some or all of your capital. You should not trade or invest money you cannot
        afford to lose.
      </p>

      <h2>2. Leverage</h2>
      <p>
        Leveraged products magnify both gains and losses. A small market movement can have a proportionally larger
        impact on funds you have deposited or allocated, and losses can exceed initial expectations.
      </p>

      <h2>3. Cryptocurrency risk</h2>
      <p>
        Cryptoassets are highly volatile, may be unregulated in your jurisdiction, and can be subject to sudden price
        movements, liquidity shortfalls, exchange failures and technological or security risks. You are unlikely to be
        protected if something goes wrong.
      </p>

      <h2>4. No financial advice</h2>
      <p>
        All content published by {siteConfig.name} — including trade ideas, “elite trades”, signals, market analysis,
        live sessions and community discussion — is provided for informational and educational purposes only. It does
        not take into account your objectives, financial situation or needs, and does not constitute investment,
        financial, legal or tax advice, or a recommendation to buy or sell any instrument.
      </p>

      <h2>5. Performance information</h2>
      <ul>
        <li>Past performance is not indicative of future results.</li>
        <li>
          Figures labelled “demo”, “sample”, “illustrative” or “placeholder” on this website are not real or verified
          results and are shown for layout and demonstration purposes only.
        </li>
        <li>Hypothetical or simulated results have inherent limitations and do not reflect actual trading.</li>
      </ul>

      <h2>6. Market data</h2>
      <p>
        Unless explicitly labelled “Live”, prices and market data on this website are demonstration or delayed values
        and must not be used to make trading decisions.
      </p>

      <h2>7. Investment pools</h2>
      <p>
        Information about investment pools is provided for information only and is not an offer, solicitation or
        invitation to invest. Any participation would be subject to eligibility checks, suitability review, written
        terms and all applicable laws and regulations in the relevant jurisdiction. No returns are promised or
        guaranteed, and you may lose all capital allocated.
      </p>

      <h2>8. Independent advice</h2>
      <p>
        You should conduct your own research and, where appropriate, seek independent advice from a suitably qualified
        and authorised professional before making any trading or investment decision.
      </p>

      <h2>9. Regulatory status</h2>
      <p>
        [Placeholder — to be completed by legal counsel: details of the operating entity, registered address, any
        regulatory authorisations or exemptions held, and the jurisdictions in which services are and are not
        offered.]
      </p>
    </LegalPage>
  );
}
