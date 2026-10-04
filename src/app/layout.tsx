import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { siteConfig } from "@/lib/site";
import { getMarketSnapshot } from "@/services/marketData";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TickerTape } from "@/components/layout/TickerTape";
import { PointerFX } from "@/components/visuals/PointerFX";
import { MarketProvider } from "@/components/markets/MarketProvider";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--nf-sans", display: "swap" });
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--nf-display",
  weight: ["300", "400", "500"],
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--nf-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Gold & Bitcoin Trading, Market Intelligence & Investment Pools`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  // Private members' site: keep every page out of search engines.
  robots: { index: false, follow: false, nocache: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#030405",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  slogan: siteConfig.tagline,
  description: siteConfig.description,
  email: siteConfig.email,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const snapshot = await getMarketSnapshot();
  return (
    <html lang="en-GB" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="min-h-screen">
        <a
          href="#main"
          className="fixed top-3 left-3 z-[100] -translate-y-24 bg-gold px-4 py-2 font-mono text-xs font-medium text-ink transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        {/* Ambient terminal backdrop */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="dot-bg absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,225,255,0.05),transparent_60%)]" />
        </div>
        <PointerFX />
        <MarketProvider initial={snapshot}>
          <Navbar ticker={<TickerTape snapshot={snapshot} />} />
          <main id="main">{children}</main>
          <Footer />
        </MarketProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
