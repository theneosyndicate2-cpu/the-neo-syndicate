import "server-only";
import { desc, eq, inArray, or } from "drizzle-orm";
import { getDb, schema } from "@/db";
import type { SessionUser } from "@/lib/server/auth";
import { TIERS, tierRank } from "@/lib/tiers";

/** Applications belonging to the user (linked by account, or made earlier with the same email). */
export async function listMyApplications(user: SessionUser) {
  const db = await getDb();
  return db
    .select()
    .from(schema.applications)
    .where(or(eq(schema.applications.userId, user.id), eq(schema.applications.email, user.email)))
    .orderBy(desc(schema.applications.createdAt));
}

/** Announcements visible at the user's tier, pinned first. */
export async function listAnnouncements(user: SessionUser, limit = 20) {
  const db = await getDb();
  const visible = TIERS.filter((t) => tierRank(t.id) <= tierRank(user.tier)).map((t) => t.id);
  return db
    .select()
    .from(schema.announcements)
    .where(inArray(schema.announcements.minTier, visible))
    .orderBy(desc(schema.announcements.pinned), desc(schema.announcements.publishedAt))
    .limit(limit);
}
