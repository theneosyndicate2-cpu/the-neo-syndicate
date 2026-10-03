import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/syndicate", priority: 0.8, changeFrequency: "monthly" },
  { path: "/markets", priority: 0.9, changeFrequency: "daily" },
  { path: "/trades", priority: 0.9, changeFrequency: "daily" },
  { path: "/invest", priority: 0.9, changeFrequency: "weekly" },
  { path: "/community", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/risk-disclosure", priority: 0.4, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((r) => ({
    url: `${siteConfig.url}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
