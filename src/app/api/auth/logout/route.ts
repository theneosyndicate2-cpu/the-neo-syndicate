import { destroySession } from "@/lib/server/auth";
import { forbidden, json, sameOrigin } from "@/lib/server/http";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return forbidden();
  await destroySession();
  return json({ ok: true });
}
