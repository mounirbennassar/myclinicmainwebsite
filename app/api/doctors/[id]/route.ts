import { DOCTOR_ROLES, HttpError, errorResponse, requireRoles } from "@/app/lib/auth";
import { DOCTOR_ARRAY_COLS, DOCTOR_TEXT_COLS, arr, str } from "@/app/lib/doctors";
import { query, queryOne } from "@/app/lib/db";
import { revalidateDoctorPages } from "../route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/**
 * Partial update (admin). Only keys actually present in the body are touched,
 * so the dashboard's inline active-toggle can PATCH {is_active} on its own
 * without blanking every other column.
 */
export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireRoles(...DOCTOR_ROLES);
    const { id } = await params;
    const body: Record<string, unknown> = await request.json().catch(() => ({}));

    const sets: string[] = [];
    const values: unknown[] = [];
    const set = (col: string, value: unknown, cast = "") => {
      values.push(value);
      sets.push(`${col} = $${values.length}${cast}`);
    };

    if ("name_en" in body) {
      const name = str(body.name_en);
      if (!name) throw new HttpError(400, "Name cannot be empty");
      set("name_en", name);
    }
    for (const col of DOCTOR_TEXT_COLS) if (col in body) set(col, str(body[col]));
    for (const col of DOCTOR_ARRAY_COLS) if (col in body) set(col, arr(body[col]), "::text[]");
    if ("is_active" in body) set("is_active", Boolean(body.is_active));
    if ("sort_order" in body) set("sort_order", Number(body.sort_order) || 0);

    if (!sets.length) throw new HttpError(400, "Nothing to update");

    sets.push("updated_at = now()");
    values.push(id);
    const doctor = await queryOne(
      `update doctors set ${sets.join(", ")} where id = $${values.length}::uuid returning *`,
      values
    );
    if (!doctor) throw new HttpError(404, "Doctor not found");
    revalidateDoctorPages();
    return Response.json({ doctor });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireRoles(...DOCTOR_ROLES);
    const { id } = await params;
    await query("delete from doctors where id = $1::uuid", [id]);
    revalidateDoctorPages();
    return Response.json({ success: true });
  } catch (err) {
    return errorResponse(err);
  }
}
