import { query, queryOne } from "./db";

export type Doctor = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string | null;
  email: string | null;
  image_url: string | null;
  qualification_en: string | null;
  qualification_ar: string | null;
  specialty_raw: string | null;
  specialties: string[];
  title: string | null;
  title_ar: string | null;
  languages: string | null;
  /** "female" | "male" | null — picks the illustration when image_url is empty. */
  gender: string | null;
  branches: string[];
  cities: string[];
  is_active: boolean;
  sort_order: number;
};

/**
 * The only fields a carousel card actually renders. The home page ships its
 * whole roster to the browser inside the RSC payload, so every unused column
 * is dead weight in the HTML — narrowing the prop lets the page send half as
 * much. `Doctor` is assignable to this, so callers holding full records
 * (the dental and pediatric strips) keep working unchanged.
 */
export type DoctorCard = Pick<
  Doctor,
  "id" | "slug" | "name_en" | "name_ar" | "image_url" | "specialties" | "specialty_raw"
>;

/** Strip a full record down to what a card needs. */
export function toDoctorCard(d: Doctor): DoctorCard {
  return {
    id: d.id,
    slug: d.slug,
    name_en: d.name_en,
    name_ar: d.name_ar,
    image_url: d.image_url,
    specialties: d.specialties,
    specialty_raw: d.specialty_raw,
  };
}

// Lightweight column set for lists/cards/carousels (skips email).
const CARD_COLS =
  "id, slug, name_en, name_ar, image_url, qualification_en, qualification_ar, specialty_raw," +
  " specialties, title, title_ar, languages, gender, branches, cities, is_active, sort_order";

/** Every text column an admin may write. name_en is required and handled separately. */
export const DOCTOR_TEXT_COLS = [
  "name_ar",
  "email",
  "image_url",
  "qualification_en",
  "qualification_ar",
  "specialty_raw",
  "title",
  "title_ar",
  "languages",
  "gender",
] as const;

/** Every text[] column an admin may write. */
export const DOCTOR_ARRAY_COLS = ["specialties", "branches", "cities"] as const;

/** Coerce an untrusted JSON value to a trimmed string, or null when blank. */
export function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

/** Coerce an untrusted JSON value to a string[], dropping blanks. */
export function arr(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "") : [];
}

/** All active doctors (card fields) — used by the directory + home carousel. */
export function getAllActiveDoctors(): Promise<Doctor[]> {
  return query<Doctor>(
    `select ${CARD_COLS} from doctors where is_active order by sort_order desc, name_en asc`
  );
}

/**
 * Active doctors in one canonical specialty — used by landing-page carousels
 * and the dental/pediatric strips.
 *
 * Unlimited by default. It used to stop at 16, which quietly hid most of a
 * specialty from its own landing page (39 of 55 pediatricians, 24 of 40 family
 * doctors). A caller that genuinely wants a teaser must now say so, because
 * the failure mode of the old default was invisible: the page looked full.
 */
export function getDoctorsBySpecialty(specialty: string, limit: number | null = null): Promise<Doctor[]> {
  return query<Doctor>(
    `select ${CARD_COLS} from doctors
     where is_active and specialties @> ARRAY[$1]::text[]
     order by sort_order desc, name_en asc
     ${limit === null ? "" : "limit $2"}`,
    limit === null ? [specialty] : [specialty, limit]
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
