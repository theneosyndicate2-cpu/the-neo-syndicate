import { requireUser } from "@/lib/server/auth";

/**
 * Members-only area. `src/proxy.ts` redirects visitors without a session cookie
 * (preserving the requested path); this layout validates the session itself.
 */
export default async function MembersLayout({ children }: { children: React.ReactNode }) {
  await requireUser("/");
  return children;
}
