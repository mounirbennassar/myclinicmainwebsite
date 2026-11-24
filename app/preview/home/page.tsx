import { createHash, timingSafeEqual } from "node:crypto";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllActiveDoctors, orderDoctorsForDisplay, toDoctorCard, type DoctorCard } from "@/app/lib/doctors";
import NewHome from "./NewHome";

/**
 * v2 home page — INTERNAL PREVIEW.
 *
 * PREVIEW GATE (same pattern as app/leadership/page.tsx): the page only
 * renders for /preview/home?key=<preview key>; every other request gets the
 * site's normal 404, so it does not appear to exist. Only the key's SHA-256
 * is stored because this repo is public. To rotate, hash a new key
 * (`printf %s NEWKEY | shasum -a 256`) and replace the value. It is also
 * noindex, not in sitemap.ts, and deliberately NOT in robots.ts (a Disallow
 * line would publish the path).
 *
 * Data: the same server-side doctor roster the live home bakes in, with the
 * same unreachable-DB budget (see app/page.tsx for the reasoning).
 */

// No custom title: a keyless request 404s with this metadata attached, and a
// telling title would reveal that the page exists.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const PREVIEW_KEY_SHA256 = "c93ed2a1b912fb10febee58ee4e1c6ed0c56243af75dd33c39e41409595913c7";

function keyMatches(key: string): boolean {
  const given = createHash("sha256").update(key).digest();
  return timingSafeEqual(given, Buffer.from(PREVIEW_KEY_SHA256, "hex"));
}

const DOCTORS_SSR_BUDGET_MS = 2500;

async function doctorsWithinBudget(): Promise<DoctorCard[]> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const rows = await Promise.race([
      getAllActiveDoctors(),
      new Promise<[]>((resolve) => {
        timer = setTimeout(() => resolve([]), DOCTORS_SSR_BUDGET_MS);
      }),
    ]);
    return rows.map(toDoctorCard);
  } finally {
    clearTimeout(timer);
  }
}

export default async function HomePreview({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { key } = await searchParams;
  if (typeof key !== "string" || !keyMatches(key)) notFound();

  let doctors: DoctorCard[] = [];
  try {
    doctors = orderDoctorsForDisplay(await doctorsWithinBudget());
  } catch {
    // Unreachable DB: the doctors rail falls back to its client fetch.
  }
  return <NewHome initialDoctors={doctors.length ? doctors : undefined} />;
}
