import type { MembershipTier } from "@/lib/types";

/** Membership tiers, lowest → highest. Shared by server and client. */
export const TIERS: { id: MembershipTier; label: string; description: string }[] = [
  { id: "observer", label: "Observer", description: "Announcements, market intelligence and application tracking." },
  { id: "member", label: "Member", description: "Full elite trade log, desk briefings and live sessions." },
  { id: "elite", label: "Elite", description: "Priority setups, pool access and direct desk contact." },
  { id: "private-capital", label: "Private Capital", description: "Private allocations with bespoke reporting." },
];

export const tierRank = (tier: string) => Math.max(0, TIERS.findIndex((t) => t.id === tier));
export const hasTier = (tier: string, min: MembershipTier) => tierRank(tier) >= tierRank(min);
export const tierLabel = (tier: string) => TIERS.find((t) => t.id === tier)?.label ?? "Observer";
export const isTier = (v: unknown): v is MembershipTier => TIERS.some((t) => t.id === v);
