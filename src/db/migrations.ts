/**
 * Ordered SQL migrations, applied once each at startup (tracked in `_migrations`).
 * Never edit an applied migration — append a new one.
 * Kept in TypeScript so they ship inside the server bundle on any host.
 */
export const migrations: { id: string; sql: string }[] = [
  {
    id: "0001_init",
    sql: /* sql */ `
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email text NOT NULL UNIQUE,
        name text NOT NULL,
        telegram text,
        password_hash text NOT NULL,
        tier text NOT NULL DEFAULT 'observer',
        role text NOT NULL DEFAULT 'member',
        email_verified_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id text PRIMARY KEY,
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at timestamptz NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        last_seen_at timestamptz NOT NULL DEFAULT now(),
        user_agent text
      );
      CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);

      CREATE TABLE IF NOT EXISTS applications (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        reference text NOT NULL UNIQUE,
        user_id uuid REFERENCES users(id) ON DELETE SET NULL,
        email text NOT NULL,
        full_name text NOT NULL,
        telegram text,
        country text NOT NULL,
        amount text NOT NULL,
        pool text NOT NULL,
        message text,
        status text NOT NULL DEFAULT 'received',
        email_verified boolean NOT NULL DEFAULT false,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS applications_user_idx ON applications(user_id);
      CREATE INDEX IF NOT EXISTS applications_email_idx ON applications(email);

      CREATE TABLE IF NOT EXISTS announcements (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        title text NOT NULL,
        body text NOT NULL,
        min_tier text NOT NULL DEFAULT 'observer',
        pinned boolean NOT NULL DEFAULT false,
        published_at timestamptz NOT NULL DEFAULT now()
      );
    `,
  },
  {
    id: "0002_seed_announcements",
    sql: /* sql */ `
      INSERT INTO announcements (title, body, min_tier, pinned) VALUES
      ('Welcome to the Syndicate portal',
       'Your portal is where you will find desk announcements, the status of your applications and — for members — the full elite trade log. Complete your profile and add your Telegram username so the desk can reach you.',
       'observer', true),
      ('Weekly desk briefing',
       'Members: the weekly briefing covers gold positioning into the US data calendar, BTC range levels and risk budget for the week. Join the live session in Telegram.',
       'member', false);
    `,
  },
];
