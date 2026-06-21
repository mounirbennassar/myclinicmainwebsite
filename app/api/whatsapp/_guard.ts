import { NextResponse } from "next/server";

export function requireAdmin(request: Request): NextResponse | null {
  const role = request.headers.get("x-user-role");
  if (role !== "super_admin" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
