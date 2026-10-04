import { getCurrentUser } from "@/lib/server/auth";
import { json } from "@/lib/server/http";

export const dynamic = "force-dynamic";

/** Lightweight session check for client UI (navbar). */
export async function GET() {
  const user = await getCurrentUser();
  return json({ user: user ? { name: user.name, email: user.email, telegram: user.telegram, tier: user.tier } : null });
}
