import { NextResponse } from "next/server";
import { query, queryOne } from "@/app/lib/db";
import { hashPassword, generatePassword } from "@/app/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = request.headers.get("x-user-role");
  if (role !== "super_admin" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, allowed_cities, is_active, reset_password, memberRole } = body;

    // City isolation: a non-super_admin admin can only modify members whose
    // existing allowed_cities overlap their own scope, and cannot grant cities
    // outside that scope.
    if (role !== "super_admin") {
      let scope: string[] = [];
      try {
        scope = JSON.parse(request.headers.get("x-user-cities") || "[]");
      } catch {
        scope = [];
      }
      const target = await queryOne<{ allowed_cities: string[] | null; role: string }>(
        "select allowed_cities, role from team_members where id = $1",
        [id]
      );
      if (!target) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (target.role === "super_admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const targetCities: string[] = target.allowed_cities || [];
      const overlap = targetCities.some((c) => scope.includes(c));
      if (!overlap) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (Array.isArray(allowed_cities) && allowed_cities.some((c: string) => !scope.includes(c))) {
        return NextResponse.json({ error: "Cannot assign cities outside your scope" }, { status: 403 });
      }
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (name !== undefined) updates.name = name;
    if (allowed_cities !== undefined) updates.allowed_cities = allowed_cities;
    if (is_active !== undefined) updates.is_active = is_active;
    if (memberRole !== undefined) updates.role = memberRole;
    if (body.can_export !== undefined) updates.can_export = body.can_export;

    let newPassword: string | undefined;
    if (reset_password) {
      newPassword = generatePassword();
      updates.password_hash = await hashPassword(newPassword);
    }

    const cols = Object.keys(updates);
    const setParts = cols.map((c, i) =>
      c === "allowed_cities" ? `${c} = $${i + 1}::text[]` : `${c} = $${i + 1}`
    );
    const values = cols.map((c) => updates[c]);
    values.push(id);
    await query(
      `update team_members set ${setParts.join(", ")} where id = $${values.length}`,
      values
    );

    return NextResponse.json({
      success: true,
      ...(newPassword ? { generated_password: newPassword } : {}),
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
