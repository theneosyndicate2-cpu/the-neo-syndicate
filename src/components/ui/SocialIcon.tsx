import type { SocialPlatform } from "@/lib/types";

/** Monochrome brand glyphs (lucide no longer ships brand icons). */
export function SocialIcon({ platform, className = "size-4" }: { platform: SocialPlatform; className?: string }) {
  switch (platform) {
    case "telegram":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
          <path d="M21.94 4.3a1.1 1.1 0 0 0-1.5-1.2L2.8 9.9c-1.2.47-1.18 1.17-.2 1.47l4.52 1.41 1.73 5.3c.21.6.11.83.74.83.49 0 .7-.22.97-.48l2.34-2.27 4.68 3.46c.86.47 1.48.23 1.7-.8l3.07-14.45ZM8.3 12.5l10.06-6.35c.48-.29.92-.13.56.19l-8.6 7.77-.34 3.62L8.3 12.5Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
          <path d="M16.6 2h-3.3v13.2a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9a6.2 6.2 0 1 0 5.3 6.1V8.6a7.9 7.9 0 0 0 4.4 1.4V6.7a4.5 4.5 0 0 1-4.4-4.7Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4.1" />
          <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}
