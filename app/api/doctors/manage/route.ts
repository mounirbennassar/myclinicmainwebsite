import { ADMIN_ROLES, errorResponse, requireRoles } from "@/app/lib/auth";
import { getAllDoctorsForAdmin } from "@/app/lib/doctors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Every doctor incl. inactive, with email — the dashboard management table. */
export async function GET() {
  try {
    await requireRoles(...ADMIN_ROLES);
    return Response.json({ doctors: await getAllDoctorsForAdmin() });
  } catch (err) {
    return errorResponse(err);
  }
}
