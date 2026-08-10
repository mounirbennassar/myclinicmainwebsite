import { getDoctorsBySpecialty } from "@/app/lib/doctors";
import KidsHub from "./KidsHub";

// Pediatric doctors are fetched on the server and baked into the page, so the
// carousel never depends on a client-side API call. Backstop only — doctor
// mutations purge this via revalidatePath("/", "layout").
export const revalidate = 300;

export default async function PediatricPage() {
  // Every pediatrician, not the first 16 — the carousel windows the render
  // itself, so a full roster costs nothing up front.
  const doctors = await getDoctorsBySpecialty("Pediatrics");
  return <KidsHub doctors={doctors} />;
}
