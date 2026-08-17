/**
 * The My360 program catalog — slug + English label only.
 *
 * Split out of content.ts on purpose: the dashboard's lead filters need the
 * slugs, and importing content.ts there would pull the whole bilingual copy of
 * the landing page into the dashboard bundle. Keep this in sync with
 * ALLOWED_MY360_PROGRAMS in app/api/appointments/route.ts.
 */
export const my360ProgramCatalog = [
  { slug: "grow", en: "My360 Grow (0–18)" },
  { slug: "live", en: "My360 Live (19–64)" },
  { slug: "thrive", en: "My360 Thrive (65+)" },
  { slug: "diabetes", en: "My360 Diabetes" },
] as const;

export type My360Program = (typeof my360ProgramCatalog)[number]["slug"];
