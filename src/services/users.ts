import "server-only";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { hashPassword } from "@/lib/server/auth";
import type { MembershipTier } from "@/lib/types";

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export async function findUserByEmail(email: string) {
  const db = await getDb();
  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, normalizeEmail(email))).limit(1);
  return user ?? null;
}

export async function createUser(input: { email: string; name: string; password: string; telegram?: string | null }) {
  const db = await getDb();
  const [user] = await db
    .insert(schema.users)
    .values({
      email: normalizeEmail(input.email),
      name: input.name.trim(),
      telegram: input.telegram?.trim() || null,
      passwordHash: await hashPassword(input.password),
      emailVerifiedAt: new Date(),
    })
    .onConflictDoNothing({ target: schema.users.email })
    .returning();
  if (user) {
    // Attach any applications made with this email before the account existed.
    await db.update(schema.applications).set({ userId: user.id }).where(eq(schema.applications.email, user.email));
  }
  return user ?? null;
}

export async function updateProfile(userId: string, data: { name: string; telegram: string | null }) {
  const db = await getDb();
  await db
    .update(schema.users)
    .set({ name: data.name.trim(), telegram: data.telegram?.trim() || null, updatedAt: new Date() })
    .where(eq(schema.users.id, userId));
}

export async function setPassword(userId: string, password: string) {
  const db = await getDb();
  await db
    .update(schema.users)
    .set({ passwordHash: await hashPassword(password), updatedAt: new Date() })
    .where(eq(schema.users.id, userId));
}

export async function setTier(email: string, tier: MembershipTier) {
  const db = await getDb();
  const [user] = await db
    .update(schema.users)
    .set({ tier, updatedAt: new Date() })
    .where(eq(schema.users.email, normalizeEmail(email)))
    .returning({ id: schema.users.id });
  return !!user;
}
