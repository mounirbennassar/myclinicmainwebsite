// Single source of truth for the clinic's medical specialties.
// Used by the homepage, /specialties and /find-doctor so the list, icons and
// translation keys never drift between pages.

export const specKeys = [
  "allergyImmunology", "audioVestibular", "cardiology", "dental", "dermatologyCosmetics",
  "emergency", "endocrinologyDiabetes", "ent", "familyMedicine", "gastroenterology",
  "generalSurgery", "geriatricMedicine", "hematology", "internalMedicine", "nephrology",
  "neurology", "nutrition", "obGyn", "occupationalMedicine", "ophthalmology",
  "orthopedics", "pediatrics", "physiotherapy", "psychiatryPsychology", "pulmonologySleep",
  "rheumatology", "urology",
] as const;

export type SpecKey = (typeof specKeys)[number];

// Material Symbols icon name per specialty (index-aligned with specKeys).
export const specIcons = [
  "vaccines", "hearing", "cardiology", "dentistry", "dermatology",
  "emergency", "metabolism", "ent", "family_restroom", "gastroenterology",
  "surgical", "elderly", "bloodtype", "stethoscope", "nephrology",
  "neurology", "restaurant", "health_and_safety", "work", "visibility",
  "skeleton", "child_care", "physical_therapy", "psychology", "pulmonology",
  "rheumatology", "water_drop",
];

// Canonical English display names (index-aligned with specKeys). These match the
// `spec` field used in doctors-data.ts for most specialties.
export const specEnNames = [
  "Allergy & Immunology", "Audio-vestibular & Speech", "Cardiology", "Dental", "Dermatology & Cosmetics",
  "Emergency", "Endocrinology & Diabetes", "ENT", "Family Medicine", "Gastroenterology",
  "General & Bariatric Surgery", "Geriatric Medicine", "Hematology", "Internal Medicine", "Nephrology",
  "Neurology", "Nutrition", "Obstetrics & Gynecology", "Occupational Medicine", "Ophthalmology",
  "Orthopedics", "Pediatrics", "Physiotherapy", "Psychiatry & Psychology", "Pulmonology & Sleep Medicine",
  "Rheumatology", "Urology",
];

// The specialty filter labels exactly as the `spec` field appears in
// doctors-data.ts (a couple differ from specEnNames above).
export const doctorFilters = [
  "Allergy & Immunology", "Audio-vestibular & Speech", "Cardiology", "Dental",
  "Dermatology & Cosmetics", "Emergency", "Endocrinology & Diabetes", "ENT",
  "Family Medicine", "Gastroenterology & Hepatology", "General & Bariatric Surgery", "Geriatric Medicine",
  "Hematology", "Internal Medicine", "Nephrology", "Neurology", "Nutrition",
  "Obstetrics & Gynecology", "Occupational Medicine", "Ophthalmology", "Orthopedics",
  "Pediatrics", "Physiotherapy", "Psychiatry & Psychology", "Pulmonology & Sleep Medicine",
  "Rheumatology", "Urology",
];

// Map an English spec/filter name → its translation key (`spec.<key>` /
// `specDesc.<key>`). Covers both the canonical names and the doctor-filter
// variants that differ in wording.
export const specNameToKey: Record<string, SpecKey> = {};
specEnNames.forEach((name, i) => { specNameToKey[name] = specKeys[i]; });
specNameToKey["Gastroenterology & Hepatology"] = "gastroenterology";

// Map a specialty key back to the doctor-filter label (what doctors-data.ts uses
// in its `spec` field) so /specialties can deep-link into /find-doctor.
export const keyToDoctorFilter: Record<SpecKey, string> = {} as Record<SpecKey, string>;
specKeys.forEach((key, i) => { keyToDoctorFilter[key] = doctorFilters[i]; });
