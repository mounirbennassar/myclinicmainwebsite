// Turning a `doctors` row into the strings the dental/pediatric strips render.
// Pure + client-safe (no db import). Lives here so both strips agree on how a
// DB row is localized, instead of each re-deriving it.
import type { Doctor } from "./doctors";

const CITY_AR: Record<string, string> = {
  Jeddah: "جدة",
  Riyadh: "الرياض",
};

/**
 * Every branch a doctor row can name, with the spellings the roster actually
 * carries. `branches` is typed in by hand, so the same branch arrives as
 * "Al Khalidiyyah", "Al Khalidyah" and "Al Khalidyyah", or "Safa" next to
 * "Al Safa". An exact-match lookup missed every variant, so Arabic pages
 * showed "جدة المحمدية + الصفا + Al Khalidyah". `branchKey` already absorbs "Al",
 * spacing, doubled letters and iy/y, so `aliases` lists only what it cannot.
 */
const BRANCHES: { en: string; ar: string; aliases?: string[] }[] = [
  { en: "Al Mohammadiyah", ar: "المحمدية", aliases: ["Muhammadiyah", "Mohammadia", "Muhammadia"] },
  { en: "Al Safa", ar: "الصفا" },
  { en: "Al Khalidiyyah", ar: "الخالدية", aliases: ["Khalidiya", "Khaldiyah"] },
  { en: "Al Sahafa", ar: "الصحافة" },
  { en: "Al Tahlia", ar: "التحلية", aliases: ["Tahliya"] },
  { en: "Obhour", ar: "أبحر", aliases: ["Abhur", "Obhor"] },
  { en: "Petro Rabigh", ar: "بترو رابغ" },
  { en: "Jeddah", ar: "جدة" },
  { en: "Riyadh", ar: "الرياض" },
];

/** "Al Khalidyyah" → "khalidyah": no "Al", case, spaces, doubled letters or iy/y. */
function branchKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .replace(/^(al|el)/, "")
    .replace(/(.)\1+/g, "$1")
    .replace(/iy/g, "y")
    .replace(/ou/g, "u");
}

const BRANCH_BY_KEY = new Map<string, { en: string; ar: string }>();
for (const b of BRANCHES) {
  for (const name of [b.en, ...(b.aliases || [])]) BRANCH_BY_KEY.set(branchKey(name), b);
}

/**
 * A stored branch value in the page's language, spelled one way everywhere.
 * An unknown value is returned as typed — add it to BRANCHES to translate it.
 */
export function branchLabel(raw: string, isRtl: boolean): string {
  const b = BRANCH_BY_KEY.get(branchKey(raw));
  return b ? (isRtl ? b.ar : b.en) : raw;
}

const LANGUAGES: Record<string, { en: string; ar: string }> = {
  english: { en: "English", ar: "الإنجليزية" },
  englsih: { en: "English", ar: "الإنجليزية" },
  arabic: { en: "Arabic", ar: "العربية" },
  french: { en: "French", ar: "الفرنسية" },
  urdu: { en: "Urdu", ar: "الأردية" },
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
  return d.languages
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const known = LANGUAGES[l.toLowerCase()];
      return known ? (isRtl ? known.ar : known.en) : l;
    })
    .join(isRtl ? "، " : ", ");
}

/**
 * "Jeddah Al Mohammadiyah + Al Safa" / "جدة المحمدية + الصفا", every part in the
 * page's language. Branches that just repeat the city (the import writes
 * branches: ["Jeddah"] when no branch was specified) are dropped, so those
 * doctors show plain "Jeddah", and so are spelling duplicates ("Safa" next to
 * "Al Safa").
 */
export function doctorLocation(d: Doctor, isRtl: boolean): string {
  const city = d.cities?.[0];
  if (!city) return "";
  const cityLabel = isRtl ? CITY_AR[city] || city : city;
  const branches = [...new Set((d.branches || []).map((b) => branchLabel(b, isRtl)))].filter(
    (b) => b !== cityLabel
  );
  return [cityLabel, ...branches].join(" + ").replace(/^(\S+) \+ /, "$1 ");
}
