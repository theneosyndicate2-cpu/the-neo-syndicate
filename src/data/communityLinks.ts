import type { CommunityLink } from "@/lib/types";

/**
 * Community links. Set NEXT_PUBLIC_*_URL env vars to replace the placeholders.
 */
const telegram = process.env.NEXT_PUBLIC_TELEGRAM_URL;
const tiktok = process.env.NEXT_PUBLIC_TIKTOK_URL;
const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

export const communityLinks: CommunityLink[] = [
  {
    platform: "telegram",
    label: "Telegram",
    handle: "@theneosyndicate",
    href: telegram || "https://t.me/",
    cta: "Join Telegram",
    description: "Elite trades, desk updates and member discussion.",
    isPlaceholder: !telegram,
  },
  {
    platform: "tiktok",
    label: "TikTok",
    handle: "@theneosyndicate",
    href: tiktok || "https://www.tiktok.com/",
    cta: "Follow TikTok",
    description: "Short-form market breakdowns and execution insights.",
    isPlaceholder: !tiktok,
  },
  {
    platform: "instagram",
    label: "Instagram",
    handle: "@theneosyndicate",
    href: instagram || "https://www.instagram.com/",
    cta: "Follow Instagram",
    description: "Market snapshots, announcements and the Syndicate journey.",
    isPlaceholder: !instagram,
  },
];
