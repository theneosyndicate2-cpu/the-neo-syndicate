import type { MetadataRoute } from "next";

/** Private members' site — ask all crawlers to stay out. */
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
