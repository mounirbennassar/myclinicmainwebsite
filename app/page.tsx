import { getAllActiveDoctors } from "./lib/doctors";
import type { Doctor } from "./lib/doctors";
import HomeClient from "./HomeClient";

// Deterministic (pure) shuffle — mixes specialties so the carousel's "All" tab
// interleaves dental with everyone else, without an impure Math.random in render.
// Seeded by roster size so the order is stable per build yet re-mixes if the
// roster changes. mulberry32 PRNG.
function mixDoctors(list: Doctor[]): Doctor[] {
  const a = [...list];
  let s = (a.length * 2654435761) >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Doctors are fetched on the server and baked into the page, so the home
// carousel never depends on a client-side API call — same pattern as /pediatric
// and /women-care.
//
// A dashboard edit calls revalidatePath() and shows up on the very next request;
// this timer is only the backstop for when that purge doesn't land (a failed
// write, a cache miss on another edge). It matches blog/news rather than the old
// hour, because "I changed a doctor and the site still shows the old one" is the
// bug this exists to prevent, and an hour is long enough for an editor to give
// up and report it as broken.
export const revalidate = 300;

export default async function Home() {
  let doctors: Doctor[] = [];
  try {
    doctors = mixDoctors(await getAllActiveDoctors());
  } catch {
    // The page must stay buildable without a reachable database; the carousel
    // then falls back to its client-side /api/doctors fetch.
  }
  return <HomeClient initialDoctors={doctors.length ? doctors : undefined} />;
}
