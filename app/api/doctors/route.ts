import { DOCTOR_ROLES, HttpError, errorResponse, requireRoles } from "@/app/lib/auth";
import { DOCTOR_ARRAY_COLS, DOCTOR_TEXT_COLS, arr, str, uniqueDoctorSlug } from "@/app/lib/doctors";
import { query, queryOne } from "@/app/lib/db";
import { revalidateDoctorPages } from "@/app/lib/revalidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CARD_COLS =
  "id, slug, name_en, name_ar, image_url, qualification_en, qualification_ar, specialty_raw," +
  " specialties, title, title_ar, languages, gender, branches, cities, is_active, sort_order";

/** Public list — feeds the home/landing carousels and /find-doctor. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get("specialty");
    const limitRaw = Number(searchParams.get("limit"));
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : null;

    // A `?specialty=` query used to fall back to `limit 16` when the caller
    // named no limit, so a carousel asking for "every cardiologist" silently
    // got the first 16. Absent `?limit=` now means exactly that: no limit.
    const doctors = specialty
      ? await query(
          `select ${CARD_COLS} from doctors
           where is_active and specialties @> ARRAY[$1]::text[]
           order by sort_order desc, name_en asc
           ${limit === null ? "" : "limit $2"}`,
          limit === null ? [specialty] : [specialty, limit]
        )
      : await query(
          `select ${CARD_COLS} from doctors where is_active order by sort_order desc, name_en asc`
        );

    // `max-age=300` let a browser keep serving the old roster for five minutes
    // after a dashboard save, which reads as "I added a doctor and they aren't
    // there". A cache purge cannot reach a private cache, so don't create one:
    // revalidate every time, and let shared caches serve stale only while they
    // refetch in the background.
    return Response.json(
      { doctors },
      { headers: { "Cache-Control": "public, max-age=0, must-revalidate, s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch (err) {
    return errorResponse(err);
  }
}

/** Create a doctor (admin). The slug is derived from the name, never supplied. */
export async function POST(request: Request) {
  try {
    await requireRoles(...DOCTOR_ROLES);
    const body = await request.json().catch(() => ({}));

    const nameEn = str(body.name_en);
    if (!nameEn) throw new HttpError(400, "English name is required");

    const cols = ["slug", "name_en", ...DOCTOR_TEXT_COLS, ...DOCTOR_ARRAY_COLS, "is_active", "sort_order"];
    const values: unknown[] = [
      await uniqueDoctorSlug(nameEn),
      nameEn,
      ...DOCTOR_TEXT_COLS.map((c) => str(body[c])),
      ...DOCTOR_ARRAY_COLS.map((c) => arr(body[c])),
      body.is_active !== false,
      Number(body.sort_order) || 0,
    ];
    const placeholders = cols.map((c, i) =>
      (DOCTOR_ARRAY_COLS as readonly string[]).includes(c) ? `$${i + 1}::text[]` : `$${i + 1}`
    );

    const doctor = await queryOne<{ slug: string }>(
      `insert into doctors (${cols.join(", ")}) values (${placeholders.join(", ")}) returning *`,
      values
    );
    await revalidateDoctorPages(doctor?.slug);
    return Response.json({ doctor });
  } catch (err) {
    return errorResponse(err);
  }
}
