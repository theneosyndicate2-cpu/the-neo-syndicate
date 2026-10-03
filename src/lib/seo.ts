import type { Metadata } from "next";
import { siteConfig } from "./site";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}

/** Builds consistent per-page metadata (canonical, Open Graph, X/Twitter). */
export function pageMetadata({ title, description, path, keywords }: PageMetaInput): Metadata {
  const url = `${siteConfig.url}${path}`;
  return {
    title,
    description,
    keywords: keywords ?? [...siteConfig.keywords],
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      title: `${title} | ${siteConfig.name}`,
      description,
      locale: "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
    },
  };
}
