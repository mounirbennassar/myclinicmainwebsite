import { query, queryOne } from "./db";

export type Doctor = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string | null;
  email: string | null;
  image_url: string | null;
  qualification_en: string | null;
  specialty_raw: string | null;
  specialties: string[];
  title: string | null;
  branches: string[];
  cities: string[];
  is_active: boolean;
  sort_order: number;
};

// Lightweight column set for lists/cards/carousels (skips email).
const CARD_COLS =
  "id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order";

/** All active doctors (card fields) — used by the directory + home carousel. */
export function getAllActiveDoctors(): Promise<Doctor[]> {
  return query<Doctor>(
    `select ${CARD_COLS} from doctors where is_active order by sort_order desc, name_en asc`
  );
}

/** Active doctors in one canonical specialty — used by landing-page carousels. */
export function getDoctorsBySpecialty(specialty: string, limit = 16): Promise<Doctor[]> {
  return query<Doctor>(
    `select ${CARD_COLS} from doctors
     where is_active and specialties @> ARRAY[$1]::text[]
     order by sort_order desc, name_en asc
     limit $2`,
    [specialty, limit]
  );
}

/** Featured/leading doctors for the home carousel. */
export function getFeaturedDoctors(limit = 16): Promise<Doctor[]> {
  return query<Doctor>(
    `select ${CARD_COLS} from doctors where is_active order by sort_order desc, name_en asc limit $1`,
    [limit]
  );
}

/** Full record for a doctor's detail page. */
export function getDoctorBySlug(slug: string): Promise<Doctor | null> {
  return queryOne<Doctor>("select * from doctors where slug = $1", [slug]);
}

/** Slugs of all active doctors — for generateStaticParams. */
export async function getAllDoctorSlugs(): Promise<string[]> {
  const rows = await query<{ slug: string }>("select slug from doctors where is_active");
  return rows.map((r) => r.slug);
}

/** Every doctor incl. inactive — for the dashboard management table. */
export function getAllDoctorsForAdmin(): Promise<Doctor[]> {
  return query<Doctor>(`select ${CARD_COLS}, email from doctors order by sort_order desc, name_en asc`);
}

/** Build a unique slug from a name (dr-<name>, with -2/-3… on collision). */
export async function uniqueDoctorSlug(name: string, excludeId?: string): Promise<string> {
  const base =
    "dr-" +
    (name || "doctor")
      .replace(/^\s*dr\.?\s*/i, "")
      .toLowerCase()
      .normalize("NFKD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "dr-doctor";
  let slug = base;
  for (let i = 2; ; i++) {
    const clash = await queryOne<{ id: string }>("select id from doctors where slug = $1 and ($2::uuid is null or id <> $2)", [slug, excludeId ?? null]);
    if (!clash) return slug;
    slug = `${base}-${i}`;
  }
}
