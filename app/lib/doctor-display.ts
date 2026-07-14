// Turning a `doctors` row into the strings the dental/pediatric strips render.
// Pure + client-safe (no db import). Lives here so both strips agree on how a
// DB row is localized, instead of each re-deriving it.
import type { Doctor } from "./doctors";

const CITY_AR: Record<string, string> = {
  Jeddah: "جدة",
  Riyadh: "الرياض",
};

const BRANCH_AR: Record<string, string> = {
  "Al Mohammadiyah": "المحمدية",
  "Al Safa": "الصفا",
  "Al Khalidiyyah": "الخالدية",
  "Al Sahafa": "الصحافة",
  "Al Tahlia": "التحلية",
  Obhour: "أبحر",
  Jeddah: "جدة",
};

const LANGUAGES_AR: Record<string, string> = {
  English: "الإنجليزية",
  Arabic: "العربية",
  French: "الفرنسية",
};

export function doctorName(d: Doctor, isRtl: boolean): string {
  return isRtl && d.name_ar ? d.name_ar : d.name_en;
}

/**
 * The line under the name — "Endodontics Consultant", not "Consultant".
 *
 * Careful: `specialty_raw` is the descriptive line the site has always shown
 * (it is what the old static file called `title`), while the DB's `title` column
 * holds only the seniority word and is rendered nowhere. Falling back to `title`
 * is better than showing nothing. In Arabic, title_ar is the translation of
 * specialty_raw; it is null for doctors who were never in the static snapshot,
 * so we degrade to the English line rather than blanking it.
 */
export function doctorTitle(d: Doctor, isRtl: boolean): string {
  const en = d.specialty_raw || d.title || "";
  return isRtl ? d.title_ar || en : en;
}

/** Qualifications, one per line (they are stored newline-separated). */
export function doctorEducation(d: Doctor, isRtl: boolean): string[] {
  const source = isRtl && d.qualification_ar ? d.qualification_ar : d.qualification_en;
  return (source || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** "English, Arabic" → "الإنجليزية، العربية". Returns "" when unknown. */
export function doctorLanguages(d: Doctor, isRtl: boolean): string {
  if (!d.languages) return "";
  if (!isRtl) return d.languages;
  return d.languages
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => LANGUAGES_AR[l] || l)
    .join("، ");
}

/**
 * "Jeddah Al Mohammadiyah" / "جدة المحمدية". Branches that just repeat the city
 * (the import writes branches: ["Jeddah"] when no branch was specified) are
 * dropped, so those doctors show plain "Jeddah".
 */
export function doctorLocation(d: Doctor, isRtl: boolean): string {
  const city = d.cities?.[0];
  if (!city) return "";
  const branches = (d.branches || []).filter((b) => b !== city);
  const parts = isRtl
    ? [CITY_AR[city] || city, ...branches.map((b) => BRANCH_AR[b] || b)]
    : [city, ...branches];
  return parts.join(" + ").replace(/^(\S+) \+ /, "$1 ");
}
