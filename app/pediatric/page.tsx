import { getDoctorsBySpecialty } from "@/app/lib/doctors";
import KidsHub from "./KidsHub";

// Pediatric doctors are fetched on the server (cached hourly) and baked into the
// page, so the carousel never depends on a client-side API call.
export const revalidate = 3600;

export default async function PediatricPage() {
  const doctors = await getDoctorsBySpecialty("Pediatrics", 16);
  return <KidsHub doctors={doctors} />;
}
