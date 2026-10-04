"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { requireAdmin } from "@/lib/server/auth";
import { isTier } from "@/lib/tiers";
import { nextTradeCode } from "@/services/admin";

/**
 * Admin mutations. Every action re-checks admin rights server-side
 * (Next.js also enforces same-origin on Server Actions).
 */

export interface ActionState {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
  /** Submitted values echoed back on error so the form keeps what was typed. */
  values?: Record<string, string>;
}

const echo = (fd: FormData) =>
  Object.fromEntries([...fd.entries()].filter(([k, v]) => !k.startsWith("$") && typeof v === "string")) as Record<string, string>;

const APP_STATUSES = ["received", "under-review", "approved", "declined"];
const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const num = (fd: FormData, k: string) => {
  const v = str(fd, k).replace(/,/g, "");
  return v === "" ? NaN : Number(v);
};

function refreshMemberViews() {
  revalidatePath("/admin", "layout");
  revalidatePath("/portal", "layout");
  revalidatePath("/");
  revalidatePath("/trades");
}

/* ---------- Applications ---------- */

export async function updateApplication(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const status = str(formData, "status");
  const tier = str(formData, "tier");
  if (!APP_STATUSES.includes(status)) return;

  const db = await getDb();
  const [app] = await db
    .update(schema.applications)
    .set({ status, updatedAt: new Date() })
    .where(eq(schema.applications.id, id))
    .returning({ userId: schema.applications.userId });

  // Optionally upgrade the applicant's membership in the same step.
  if (app?.userId && tier && isTier(tier)) {
    await db.update(schema.users).set({ tier, updatedAt: new Date() }).where(eq(schema.users.id, app.userId));
  }
  refreshMemberViews();
}

/* ---------- Members ---------- */

export async function updateMember(formData: FormData) {
  const admin = await requireAdmin();
  const id = str(formData, "id");
  const tier = str(formData, "tier");
  const role = str(formData, "role");
  const db = await getDb();
  const patch: Partial<typeof schema.users.$inferInsert> = { updatedAt: new Date() };
  if (isTier(tier)) patch.tier = tier;
  // Admins can't remove their own admin role (avoids locking everyone out).
  if (["member", "analyst", "admin"].includes(role) && !(id === admin.id && role !== "admin")) patch.role = role;
  await db.update(schema.users).set(patch).where(eq(schema.users.id, id));
  refreshMemberViews();
}

/* ---------- Trades ---------- */

export async function createTrade(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const asset = str(formData, "asset");
  const direction = str(formData, "direction");
  const entry = num(formData, "entry");
  const stopLoss = num(formData, "stopLoss");
  const tps = ["tp1", "tp2", "tp3"].map((k) => num(formData, k)).filter((v) => Number.isFinite(v));
  const note = str(formData, "note").slice(0, 500);

  const errors: Record<string, string> = {};
  if (!["XAUUSD", "BTCUSD"].includes(asset)) errors.asset = "Choose an asset.";
  if (!["BUY", "SELL"].includes(direction)) errors.direction = "Choose a direction.";
  if (!Number.isFinite(entry) || entry <= 0) errors.entry = "Enter the entry price.";
  if (!Number.isFinite(stopLoss) || stopLoss <= 0) errors.stopLoss = "Enter the stop loss.";
  if (!tps.length) errors.tp1 = "Enter at least TP1.";
  if (!Object.keys(errors).length) {
    const buy = direction === "BUY";
    if (buy ? stopLoss >= entry : stopLoss <= entry) errors.stopLoss = `Stop loss must be ${buy ? "below" : "above"} entry for a ${direction}.`;
    if (tps.some((tp) => (buy ? tp <= entry : tp >= entry))) errors.tp1 = `Targets must be ${buy ? "above" : "below"} entry for a ${direction}.`;
  }
  if (Object.keys(errors).length) return { ok: false, errors, message: "Please fix the highlighted fields.", values: echo(formData) };

  const db = await getDb();
  const code = await nextTradeCode();
  await db.insert(schema.trades).values({ code, asset, direction, entry, stopLoss, takeProfits: tps, note: note || null });
  refreshMemberViews();
  return { ok: true, message: `${code} posted to members.` };
}

export async function closeTrade(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const result = str(formData, "result");
  const r = num(formData, "rMultiple");
  if (!["WIN", "LOSS", "BREAKEVEN"].includes(result)) return;
  const rMultiple = Number.isFinite(r) ? r : result === "LOSS" ? -1 : result === "BREAKEVEN" ? 0 : null;
  const db = await getDb();
  await db.update(schema.trades).set({ status: "CLOSED", result, rMultiple }).where(eq(schema.trades.id, id));
  refreshMemberViews();
}

export async function deleteTrade(formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(schema.trades).where(eq(schema.trades.id, str(formData, "id")));
  refreshMemberViews();
}

/* ---------- Announcements ---------- */

export async function createAnnouncement(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const title = str(formData, "title").slice(0, 140);
  const body = str(formData, "body").slice(0, 4000);
  const minTier = str(formData, "minTier");
  const errors: Record<string, string> = {};
  if (title.length < 3) errors.title = "Add a title.";
  if (body.length < 3) errors.body = "Write the announcement.";
  if (!isTier(minTier)) errors.minTier = "Choose an audience.";
  if (Object.keys(errors).length) return { ok: false, errors, values: echo(formData) };
  const db = await getDb();
  await db.insert(schema.announcements).values({ title, body, minTier, pinned: formData.get("pinned") === "on" });
  refreshMemberViews();
  return { ok: true, message: "Announcement published." };
}

export async function deleteAnnouncement(formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(schema.announcements).where(eq(schema.announcements.id, str(formData, "id")));
  refreshMemberViews();
}
