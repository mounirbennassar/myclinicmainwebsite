import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase";
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

    const admin = getServiceSupabase();

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
      const { data: target } = await admin
        .from("team_members")
        .select("allowed_cities, role")
        .eq("id", id)
        .single();
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

    const { error } = await admin
      .from("team_members")
      .update(updates)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      ...(newPassword ? { generated_password: newPassword } : {}),
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
