#!/usr/bin/env node
/**
 * Set a member's tier until the admin dashboard exists.
 *
 *   npm run member:tier -- <email> <observer|member|elite|private-capital>
 *   npm run member:tier -- --list
 *
 * Local embedded database: STOP the web server first (the database allows one process at a time).
 * Hosted Postgres: set DATABASE_URL and it runs against that instead.
 */
import { existsSync } from "node:fs";
import path from "node:path";

const TIERS = ["observer", "member", "elite", "private-capital"];
const [, , emailArg, tier] = process.argv;

async function open() {
  if (process.env.DATABASE_URL) {
    const { default: pg } = await import("pg");
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    return { query: (sql, params) => pool.query(sql, params), close: () => pool.end() };
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const dir = process.env.PGLITE_DIR || path.join(process.cwd(), ".data", "pglite");
  if (!existsSync(dir)) throw new Error(`No local database at ${dir} — start the site once and create an account first.`);
  const db = await PGlite.create(dir);
  return { query: (sql, params) => db.query(sql, params), close: () => db.close() };
}

const db = await open();
try {
  if (emailArg === "--list" || !emailArg) {
    const { rows } = await db.query("SELECT email, name, tier, created_at FROM users ORDER BY created_at DESC LIMIT 50");
    console.table(rows.map((r) => ({ email: r.email, name: r.name, tier: r.tier })));
    if (!emailArg) console.log("\nUsage: npm run member:tier -- <email> <" + TIERS.join("|") + ">");
  } else {
    if (!TIERS.includes(tier)) throw new Error(`Tier must be one of: ${TIERS.join(", ")}`);
    const { rows } = await db.query("UPDATE users SET tier = $1, updated_at = now() WHERE email = $2 RETURNING email, tier", [
      tier,
      emailArg.trim().toLowerCase(),
    ]);
    console.log(rows.length ? `✓ ${rows[0].email} is now ${rows[0].tier}` : `No user with email ${emailArg}`);
  }
} catch (err) {
  console.error("✗", err.message);
  process.exitCode = 1;
} finally {
  await db.close();
}
