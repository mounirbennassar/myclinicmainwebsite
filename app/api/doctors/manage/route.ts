import { NextResponse } from "next/server";
import { getAllDoctorsForAdmin } from "@/app/lib/doctors";

// Authenticated (gated by proxy) — returns every doctor incl. inactive for the
// dashboard management table.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const role = request.headers.get("x-user-role");
  if (role !== "super_admin" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const doctors = await getAllDoctorsForAdmin();
    return NextResponse.json({ doctors });
  } catch {
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}
