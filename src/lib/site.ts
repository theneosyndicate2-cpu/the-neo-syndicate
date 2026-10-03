export const siteConfig = {
  name: "The Neo Syndicate",
  shortName: "Neo Syndicate",
  tagline: "Capital. Strategy. Execution.",
  signature: "We keep building.",
  description:
    "A private trading and investment ecosystem built around disciplined execution, market intelligence and strategic capital growth across XAUUSD, BTCUSD and selected markets.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.theneosyndicate.com").replace(/\/$/, ""),
  email: "contact@theneosyndicate.com",
  keywords: [
    "Neo Syndicate",
    "gold trading",
    "XAUUSD trading",
    "BTCUSD trading",
    "trading signals",
    "investment pools",
    "market analysis",
    "trading community",
  ],
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/syndicate", label: "The Syndicate" },
  { href: "/markets", label: "Markets" },
  { href: "/trades", label: "Elite Trades" },
  { href: "/invest", label: "Investment Pools" },
  { href: "/community", label: "Community" },
] as const;

export const legalLinks = [
  { href: "/risk-disclosure", label: "Risk Disclosure" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" },
] as const;

export const RISK_DISCLAIMER_FULL =
  "Trading and investing involve substantial risk, including the possible loss of capital. Past performance is not indicative of future results. Information provided by The Neo Syndicate is for informational and educational purposes and should not be considered financial advice. Users should conduct their own research and seek independent professional advice where appropriate.";

export const RISK_DISCLAIMER_SHORT =
  "Trading and investing involve substantial risk, including the possible loss of capital. Past performance is not indicative of future results. Nothing on this website is financial advice.";

export const INVESTMENT_RISK_LINE =
  "All investment activity involves risk. Past performance does not guarantee future results.";

export const TRADES_RISK_LINE =
  "Trading involves substantial risk. Signals are educational/informational and are not guarantees of future results.";
