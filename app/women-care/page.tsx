import { getDoctorsBySpecialty } from "@/app/lib/doctors";
import type { Doctor } from "@/app/lib/doctors";
import WomenFamilyMedicine from "./WomenFamilyMedicine";

// Women's-health + family doctors are fetched on the server and baked into the
// page, so the carousel never depends on a client-side API call. Backstop only —
// doctor mutations purge this via revalidatePath("/", "layout").
export const revalidate = 300;

export default async function FemaleFamilyMedicinePage() {
  // Pull both relevant specialties and merge, OB-Gyn first (women's-health focus),
  // de-duplicating any doctor listed under both.
  const [obgyn, family] = await Promise.all([
    getDoctorsBySpecialty("Obstetrics & Gynecology", 16),
    getDoctorsBySpecialty("Family Medicine", 16),
  ]);

  const seen = new Set<string>();
  const doctors: Doctor[] = [...obgyn, ...family].filter((d) => {
    if (seen.has(d.id)) return false;
    seen.add(d.id);
    return true;
  });

  return <WomenFamilyMedicine doctors={doctors} />;
}
