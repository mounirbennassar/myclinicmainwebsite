import {
  ADMIN_ROLES,
  HttpError,
  ROLES,
  errorResponse,
  generatePassword,
  hashPassword,
  requireRoles,
} from "@/app/lib/auth";
import { query, queryOne } from "@/app/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** Partial update. Optionally resets the password and returns the new one. */
export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireRoles(...ADMIN_ROLES);
    const { id } = await params;
    const body: Record<string, unknown> = await request.json().catch(() => ({}));

    // A plain admin may only touch members inside their own cities, and never a
    // super_admin — otherwise they could edit or lock out an owner account.
    if (user.role !== "super_admin") {
      const target = await queryOne<{ allowed_cities: string[] | null; role: string }>(
        "select allowed_cities, role from team_members where id = $1::uuid",
        [id]
      );
      if (!target || target.role === "super_admin") throw new HttpError(403, "Forbidden");
      const targetCities = target.allowed_cities ?? [];
      if (!targetCities.some((c) => user.allowed_cities.includes(c))) {
        throw new HttpError(403, "Forbidden");
      }
      if (
        Array.isArray(body.allowed_cities) &&
        body.allowed_cities.some((c) => !user.allowed_cities.includes(c as string))
      ) {
        throw new HttpError(403, "Cannot assign cities outside your scope");
      }
      if (body.memberRole === "super_admin") throw new HttpError(403, "Forbidden");
    }

    const sets: string[] = ["updated_at = now()"];
    const values: unknown[] = [];
    const set = (col: string, value: unknown, cast = "") => {
      values.push(value);
      sets.push(`${col} = $${values.length}${cast}`);
    };

    if ("name" in body) set("name", body.name);
    if ("allowed_cities" in body) set("allowed_cities", body.allowed_cities, "::text[]");
    if ("is_active" in body) set("is_active", Boolean(body.is_active));
    if ("can_export" in body) set("can_export", Boolean(body.can_export));
    if ("memberRole" in body) {
      if (!(ROLES as string[]).includes(String(body.memberRole))) {
        throw new HttpError(400, "Invalid role");
      }
      set("role", body.memberRole);
    }

    let generated: string | null = null;
    if (body.reset_password) {
      generated = generatePassword();
      set("password_hash", await hashPassword(generated));
    }

    values.push(id);
    await query(
      `update team_members set ${sets.join(", ")} where id = $${values.length}::uuid`,
      values
    );

    return Response.json(generated ? { success: true, generated_password: generated } : { success: true });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const user = await requireRoles("super_admin");
    const { id } = await params;
    if (id === user.id) throw new HttpError(400, "You cannot delete your own account");

    await query("delete from team_members where id = $1::uuid", [id]);
    return Response.json({ success: true });
  } catch (err) {
    return errorResponse(err);
  }
}
