import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { query } from "@/app/lib/db";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export const config = {
  matcher: ["/dashboard/:path*", "/api/appointments/:path*", "/api/team/:path*", "/api/utm/:path*", "/api/whatsapp/:path*", "/api/auth/me"],
};

type FreshUser = {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "agent";
  allowed_cities: string[] | null;
  is_active: boolean;
  can_export: boolean | null;
};

// Cache fresh user lookups per-runtime-instance for a few seconds to keep the
// per-request DB hit cheap while still picking up super-admin edits quickly.
const userCache = new Map<string, { value: FreshUser; expiresAt: number }>();
const CACHE_TTL_MS = 5000;

async function fetchFreshUser(userId: string): Promise<FreshUser | null> {
  const cached = userCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const rows = await query<FreshUser>(
    "select id, email, name, role, allowed_cities, is_active, can_export from team_members where id = $1",
    [userId]
  );
  const user = rows[0];
  if (!user) return null;

  userCache.set(userId, { value: user, expiresAt: Date.now() + CACHE_TTL_MS });
  return user;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public appointment submissions (POST /api/appointments)
  if (pathname === "/api/appointments" && request.method === "POST") {
    return NextResponse.next();
  }

  // Allow public UTM click tracking from landing pages
  if (pathname === "/api/utm/track" && request.method === "POST") {
    return NextResponse.next();
  }

  const token = request.cookies.get("session")?.value;

  const unauthorized = () => {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session");
    return response;
  };

  if (!token) return unauthorized();

  let userId: string;
  let tokenPayload: { sub?: string; role?: string; allowed_cities?: string[]; name?: string; email?: string; can_export?: boolean };
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    tokenPayload = payload as typeof tokenPayload;
    userId = payload.sub as string;
  } catch {
    return unauthorized();
  }

  // Resolve role / allowed_cities / can_export LIVE from the DB so changes made
  // by a super-admin take effect on the user's next request — no logout needed.
  // Falls back to the JWT claims if the lookup fails (degraded mode).
  let role = tokenPayload.role as string;
  let allowedCities = (tokenPayload.allowed_cities as string[]) || [];
  let canExport = Boolean(tokenPayload.can_export);
  let name = (tokenPayload.name as string) || "";
  let email = (tokenPayload.email as string) || "";

  try {
    const fresh = await fetchFreshUser(userId);
    if (fresh) {
      if (!fresh.is_active) return unauthorized();
      role = fresh.role;
      allowedCities = fresh.allowed_cities || [];
      canExport =
        fresh.role === "super_admin" || fresh.role === "admin"
          ? true
          : Boolean(fresh.can_export);
      name = fresh.name;
      email = fresh.email;
    }
  } catch {
    // Network/DB hiccup — fall back to JWT claims.
  }

  const headers = new Headers(request.headers);
  headers.set("x-user-id", userId);
  headers.set("x-user-role", role);
  headers.set("x-user-cities", JSON.stringify(allowedCities));
  headers.set("x-user-name", name);
  headers.set("x-user-email", email);
  headers.set("x-user-can-export", String(canExport));

  return NextResponse.next({ request: { headers } });
}
