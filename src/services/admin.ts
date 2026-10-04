import "server-only";
import { count, desc, eq, sql } from "drizzle-orm";
import { getDb, schema } from "@/db";

/** Read models for the admin dashboard. */

export async function adminOverview() {
  const db = await getDb();
  const [tiers, statuses, [{ value: tradeCount }], recentUsers, recentApps] = await Promise.all([
    db.select({ tier: schema.users.tier, n: count() }).from(schema.users).groupBy(schema.users.tier),
    db.select({ status: schema.applications.status, n: count() }).from(schema.applications).groupBy(schema.applications.status),
    db.select({ value: count() }).from(schema.trades),
    db.select().from(schema.users).orderBy(desc(schema.users.createdAt)).limit(5),
    db.select().from(schema.applications).orderBy(desc(schema.applications.createdAt)).limit(5),
  ]);
  const byTier = Object.fromEntries(tiers.map((t) => [t.tier, Number(t.n)]));
  const byStatus = Object.fromEntries(statuses.map((s) => [s.status, Number(s.n)]));
  return {
    members: Object.values(byTier).reduce((a, b) => a + b, 0),
    byTier,
    byStatus,
    pendingApplications: (byStatus.received ?? 0) + (byStatus["under-review"] ?? 0),
    tradeCount: Number(tradeCount),
    recentUsers,
    recentApps,
  };
}

export async function adminApplications(status?: string) {
  const db = await getDb();
  const q = db
    .select({
      app: schema.applications,
      userTier: schema.users.tier,
      userName: schema.users.name,
    })
    .from(schema.applications)
    .leftJoin(schema.users, eq(schema.users.id, schema.applications.userId))
    .orderBy(desc(schema.applications.createdAt))
    .$dynamic();
  return status ? q.where(eq(schema.applications.status, status)) : q;
}

export async function adminMembers(search?: string) {
  const db = await getDb();
  const q = db.select().from(schema.users).orderBy(desc(schema.users.createdAt)).$dynamic();
  if (!search) return q;
  const like = `%${search.toLowerCase()}%`;
  return q.where(sql`lower(${schema.users.email}) like ${like} or lower(${schema.users.name}) like ${like}`);
}

export async function adminTrades() {
  const db = await getDb();
  return db.select().from(schema.trades).orderBy(desc(schema.trades.openedAt));
}

export async function adminAnnouncements() {
  const db = await getDb();
  return db.select().from(schema.announcements).orderBy(desc(schema.announcements.pinned), desc(schema.announcements.publishedAt));
}

/** Next sequential trade code (NS-1001, NS-1002, …). */
export async function nextTradeCode() {
  const db = await getDb();
  const rows = await db.select({ code: schema.trades.code }).from(schema.trades);
  const max = rows.reduce((m, r) => Math.max(m, Number(r.code.replace(/\D/g, "")) || 0), 1000);
  return `NS-${max + 1}`;
}
