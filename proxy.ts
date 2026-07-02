import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// Gates only the dashboard pages. All /api/* traffic is rewritten to the
// FastAPI backend (see next.config.ts), which authenticates every request
// itself — including live role/deactivation checks — so the proxy no longer
// needs a DB lookup or header injection.
export const config = {
  matcher: ["/dashboard/:path*"],
};

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  const unauthorized = () => {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session");
    return response;
  };

  if (!token) return unauthorized();

  try {
    await jwtVerify(token, JWT_SECRET);
  } catch {
    return unauthorized();
  }

  return NextResponse.next();
}
