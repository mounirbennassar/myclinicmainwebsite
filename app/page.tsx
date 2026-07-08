import { getAllActiveDoctors } from "./lib/doctors";
import type { Doctor } from "./lib/doctors";
import HomeClient from "./HomeClient";

// Doctors are fetched on the server (cached hourly) and baked into the page,
// so the home carousel never depends on a client-side API call — same pattern
// as /pediatric and /female-medicine.
export const revalidate = 3600;

export default async function Home() {
  let doctors: Doctor[] = [];
  try {
    doctors = await getAllActiveDoctors();
  } catch {
    // The page must stay buildable without a reachable database; the carousel
    // then falls back to its client-side /api/doctors fetch.
  }
  return <HomeClient initialDoctors={doctors.length ? doctors : undefined} />;
}
