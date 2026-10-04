import "server-only";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";
import { migrations } from "./migrations";

/**
 * Database access.
 *
 * - DATABASE_URL set  → PostgreSQL over `pg` (Neon, Supabase, RDS, Railway…).
 * - DATABASE_URL unset → embedded PostgreSQL (PGlite) persisted to `.data/pglite`
 *   — zero setup for local development. Not for multi-instance/serverless production.
 *
 * Migrations in ./migrations.ts run automatically on first use.
 */

export type Database = PgDatabase<PgQueryResultHKT, typeof schema>;

interface Handle {
  db: Database;
  exec: (sql: string) => Promise<void>;
  rows: <T>(sql: string) => Promise<T[]>;
}

const globalForDb = globalThis as unknown as { __nsDb?: Promise<Handle> };

async function connect(): Promise<Handle> {
  const url = process.env.DATABASE_URL;

  if (url) {
    const { Pool } = await import("pg");
    const { drizzle } = await import("drizzle-orm/node-postgres");
    const pool = new Pool({
      connectionString: url,
      max: Number(process.env.DATABASE_POOL_MAX ?? 5),
      ssl: /localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: false },
    });
    return {
      db: drizzle({ client: pool, schema }) as unknown as Database,
      exec: async (sql) => {
        await pool.query(sql);
      },
      rows: async <T,>(sql: string) => (await pool.query(sql)).rows as T[],
    };
  }

  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const dataDir = process.env.PGLITE_DIR || path.join(process.cwd(), ".data", "pglite");
  mkdirSync(dataDir, { recursive: true });
  const client = await PGlite.create(dataDir);
  return {
    db: drizzle({ client, schema }) as unknown as Database,
    exec: async (sql) => {
      await client.exec(sql);
    },
    rows: async <T,>(sql: string) => (await client.query<T>(sql)).rows,
  };
}

async function migrate(handle: Handle) {
  await handle.exec(`CREATE TABLE IF NOT EXISTS _migrations (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`);
  const applied = await handle.rows<{ id: string }>(`SELECT id FROM _migrations`);
  const done = new Set(applied.map((r) => r.id));
  for (const m of migrations) {
    if (done.has(m.id)) continue;
    await handle.exec(`BEGIN; ${m.sql}; INSERT INTO _migrations (id) VALUES ('${m.id}'); COMMIT;`);
    console.info(`[db] applied migration ${m.id}`);
  }
}

/** Returns the (lazily created, migrated) database. */
export function getDb(): Promise<Database> {
  if (!globalForDb.__nsDb) {
    globalForDb.__nsDb = connect()
      .then(async (handle) => {
        await migrate(handle);
        return handle;
      })
      .catch((err) => {
        globalForDb.__nsDb = undefined;
        throw err;
      });
  }
  return globalForDb.__nsDb.then((h) => h.db);
}

export { schema };
