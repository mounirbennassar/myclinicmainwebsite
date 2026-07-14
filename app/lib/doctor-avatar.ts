// Illustrated avatar fallback for doctors without a photo. Pure + client-safe
// (no db import) so both the home carousel and the dental cards can share it.
// Picks the man/woman illustration by the doctor's given name.

// Female given names among our doctors (English, lowercased) + common extras.
const FEMALE_FIRST = new Set([
  "abrar", "ahood", "anhar", "bayan", "dana", "elham", "fawziah", "fetoun",
  "futoon", "fotoun", "heba", "kawthar", "lalyan", "lilian", "lama", "lina",
  "lojain", "maysaa", "mirfat", "reyouf", "shahad", "tahani", "usra",
  "yusra", "waad", "wafaa", "walaa",
  // common Saudi/Arabic female names, for robustness beyond the current roster
  "noura", "nora", "nourah", "salma", "lara", "reda", "huda", "hoda", "hind",
  "amal", "nada", "sara", "sarah", "reem", "rasha", "rana", "dina", "maha",
  "mona", "fatima", "fatimah", "aisha", "ayesha", "asma", "asmaa", "ghada",
  "hala", "haya", "jana", "joud", "layla", "leen", "maya", "nour", "noor",
  "razan", "rima", "ruba", "sana", "shatha", "wejdan", "wafa", "yara",
  "yasmin", "yasmeen", "zainab", "zeinab", "ruba", "rahaf", "renad", "raghad",
]);

// Arabic given names that don't end in ة/اء but are female.
const FEMALE_AR = new Set([
  "عهود", "أبرار", "ابرار", "بيان", "كوثر", "لينا", "يسرا", "لوجين", "شهد",
  "تهاني", "ريوف", "وعد", "ميرفت", "لمى", "نورا", "نورة", "هند", "أمل",
]);

// Male names ending in ة/اء — exceptions to the "ends in ة → female" signal
// (otherwise Osama/Alaa/Hamza would be misread as female).
const MALE_AR = new Set([
  "أسامة", "اسامة", "حمزة", "معاوية", "طلحة", "زكريا", "علاء", "بهاء", "ضياء",
]);

function firstToken(name: string, strip: RegExp): string {
  return (name || "").replace(strip, "").trim().split(/\s+/)[0] || "";
}

export function isFemaleDoctor(nameEn: string, nameAr?: string | null): boolean {
  const en = firstToken(nameEn, /^\s*(dr\.?|rdh\.?|prof\.?|dr)\s*/i).toLowerCase();
  if (FEMALE_FIRST.has(en)) return true;
  const ar = firstToken(nameAr || "", /^\s*(د\.?|أ\.?|ا\.?|بروف\.?)\s*/);
  if (FEMALE_AR.has(ar)) return true;
  if (/ة$/.test(ar) && !MALE_AR.has(ar)) return true; // فاطمة، دانة، هبة … (not أسامة)
  return false;
}

/**
 * Illustration to use when a doctor has no photo. `gender` is the doctors.gender
 * column: when an admin has set it in the CMS it wins outright, because the
 * name-based guess above is only a heuristic and has had to be corrected by hand
 * (e.g. Dr. Rawah Eshky). It is null for most rows, which falls back to the guess.
 */
export function doctorAvatar(
  nameEn: string,
  nameAr?: string | null,
  gender?: string | null
): string {
  const female = gender ? gender === "female" : isFemaleDoctor(nameEn, nameAr);
  return female ? "/av-woman-mycliinic.png" : "/av-man-mycliinic.png";
}
