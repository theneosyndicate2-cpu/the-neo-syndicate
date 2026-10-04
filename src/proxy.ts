import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic gate for the members-only site: visitors without a session cookie
 * are sent to sign-in with the requested path preserved. Real session
 * validation happens server-side in the (members) and portal layouts.
 */

const SESSION_COOKIE = "ns_session";

export function proxy(request: NextRequest) {
  if (request.cookies.get(SESSION_COOKIE)?.value) return NextResponse.next();
  const url = request.nextUrl.clone();
  const next = request.nextUrl.pathname + request.nextUrl.search;
  url.pathname = "/login";
  url.search = `?next=${encodeURIComponent(next)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/syndicate/:path*",
    "/markets/:path*",
    "/trades/:path*",
    "/invest/:path*",
    "/community/:path*",
    "/portal/:path*",
  ],
};
