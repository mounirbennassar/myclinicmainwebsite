import { NextResponse } from "next/server";
import { query, queryOne } from "@/app/lib/db";
import { getAllActiveDoctors, getDoctorsBySpecialty, uniqueDoctorSlug } from "@/app/lib/doctors";

// GET is public (carousels). It filters by the `specialty` query param, so it
// must render per-request rather than be statically cached. POST is gated.
export const dynamic = "force-dynamic";

// The doctor list changes rarely but is fetched by every homepage visitor, so
// results are memoized in-process for a few minutes. Admin edits appear after
// the TTL (same order of staleness as the site's 1-hour ISR pages).
const CACHE_TTL_MS = 5 * 60 * 1000;
const doctorsCache = new Map<string, { body: unknown; expiresAt: number }>();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get("specialty");
    const limitParam = Number(searchParams.get("limit"));
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : undefined;

    const cacheKey = `${specialty ?? ""}|${limit ?? ""}`;
    const hit = doctorsCache.get(cacheKey);
    const now = Date.now();
    let body: unknown;
    if (hit && hit.expiresAt > now) {
      body = hit.body;
    } else {
      const doctors = specialty
        ? await getDoctorsBySpecialty(specialty, limit ?? 16)
        : await getAllActiveDoctors();
      body = { doctors };
      doctorsCache.set(cacheKey, { body, expiresAt: now + CACHE_TTL_MS });
    }

    return NextResponse.json(body, {
      headers: { "Cache-Control": "public, max-age=300" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}

const ARR = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim()) : []);
const STR = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);

export async function POST(request: Request) {
  const role = request.headers.get("x-user-role");
  if (role !== "super_admin" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const b = await request.json();
    const name_en = STR(b.name_en);
    if (!name_en) return NextResponse.json({ error: "English name is required" }, { status: 400 });

    const slug = await uniqueDoctorSlug(name_en);
    const doctor = await queryOne(
      `insert into doctors
         (slug, name_en, name_ar, email, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order)
       values ($1,$2,$3,$4,$5,$6,$7,$8::text[],$9,$10::text[],$11::text[],$12,$13)
       returning *`,
      [
        slug, name_en, STR(b.name_ar), STR(b.email), STR(b.image_url), STR(b.qualification_en),
        STR(b.specialty_raw), ARR(b.specialties), STR(b.title), ARR(b.branches), ARR(b.cities),
        b.is_active === false ? false : true, Number(b.sort_order) || 0,
      ]
    );
    doctorsCache.clear();
    return NextResponse.json({ doctor });
  } catch (err) {
    console.error("Doctor create error:", err);
    return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 });
  }
}
