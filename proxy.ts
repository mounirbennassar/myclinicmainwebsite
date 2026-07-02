import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// One image, two personalities (set per-container in docker-compose):
//
//  - main site (default): serves the public website. When PORTAL_URL is set,
//    the dashboard lives on the portal subdomain instead, so /login and
//    /dashboard/* redirect there (old links/bookmarks keep working).
//  - portal (APP_MODE=portal): serves the dashboard — the root redirects to
//    /dashboard, and every response is marked noindex so the subdomain never
//    enters search results.
//
// All /api/* traffic is rewritten to the FastAPI backend (next.config.ts),
// which authenticates every request itself — the JWT gate here only protects
// the dashboard pages.
const IS_PORTAL = process.env.APP_MODE === "portal";
const PORTAL_URL = (process.env.PORTAL_URL || "").replace(/\/+$/, "");

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};

function noindex(res: NextResponse): NextResponse {
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

async function gateDashboard(request: NextRequest): Promise<NextResponse> {
  const unauthorized = () => {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session");
    return response;
  };

  const token = request.cookies.get("session")?.value;
  if (!token) return unauthorized();
  try {
    await jwtVerify(token, JWT_SECRET);
  } catch {
    return unauthorized();
  }
  return NextResponse.next();
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (IS_PORTAL) {
    if (pathname === "/") {
      return noindex(NextResponse.redirect(new URL("/dashboard", request.url)));
    }
    if (pathname === "/login") return noindex(NextResponse.next());
    return noindex(await gateDashboard(request));
  }

  // Main site
  if (pathname === "/") return NextResponse.next();
  if (PORTAL_URL) {
    // The dashboard moved to the portal subdomain — bounce old links there.
    return NextResponse.redirect(`${PORTAL_URL}${pathname}${search}`, 307);
  }
  // No portal configured (e.g. local dev): serve the dashboard here as before.
  if (pathname === "/login") return NextResponse.next();
  return gateDashboard(request);
}
