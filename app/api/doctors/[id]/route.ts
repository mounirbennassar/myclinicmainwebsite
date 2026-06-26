import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";

const ARR = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim()) : []);
const STR = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const role = request.headers.get("x-user-role");
  if (role !== "super_admin" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { id } = await params;
    const b = await request.json();

    const sets: string[] = [];
    const vals: unknown[] = [];
    const set = (col: string, val: unknown) => { vals.push(val); sets.push(`${col} = $${vals.length}`); };
    const setArr = (col: string, val: string[]) => { vals.push(val); sets.push(`${col} = $${vals.length}::text[]`); };

    if ("name_en" in b) {
      const n = STR(b.name_en);
      if (!n) return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
      set("name_en", n);
    }
    if ("name_ar" in b) set("name_ar", STR(b.name_ar));
    if ("email" in b) set("email", STR(b.email));
    if ("image_url" in b) set("image_url", STR(b.image_url));
    if ("qualification_en" in b) set("qualification_en", STR(b.qualification_en));
    if ("specialty_raw" in b) set("specialty_raw", STR(b.specialty_raw));
    if ("title" in b) set("title", STR(b.title));
    if ("is_active" in b) set("is_active", Boolean(b.is_active));
    if ("sort_order" in b) set("sort_order", Number(b.sort_order) || 0);
    if ("specialties" in b) setArr("specialties", ARR(b.specialties));
    if ("branches" in b) setArr("branches", ARR(b.branches));
    if ("cities" in b) setArr("cities", ARR(b.cities));

    if (!sets.length) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

    sets.push("updated_at = now()");
    vals.push(id);
    const rows = await query(`update doctors set ${sets.join(", ")} where id = $${vals.length} returning *`, vals);
    if (!rows.length) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    return NextResponse.json({ doctor: rows[0] });
  } catch (err) {
    console.error("Doctor update error:", err);
    return NextResponse.json({ error: "Failed to update doctor" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const role = request.headers.get("x-user-role");
  if (role !== "super_admin" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { id } = await params;
    await query("delete from doctors where id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete doctor" }, { status: 500 });
  }
}
