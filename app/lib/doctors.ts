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
