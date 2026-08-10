import { getAllActiveDoctors, toDoctorCard } from "./lib/doctors";
import type { DoctorCard } from "./lib/doctors";
import HomeClient from "./HomeClient";

// Deterministic (pure) shuffle — mixes specialties so the carousel's "All" tab
// interleaves dental with everyone else, without an impure Math.random in render.
// Seeded by roster size so the order is stable per build yet re-mixes if the
// roster changes. mulberry32 PRNG.
function mixDoctors(list: DoctorCard[]): DoctorCard[] {
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

// A dead database rejects and the catch below handles it. An *unreachable* one
// is worse: the socket just hangs, and because this await sits in front of the
// render, the whole document hangs with it — no HTML, no TTFB, until the
// platform's own timeout fires. (Locally, against the retired Neon instance,
// `/` never responds at all.) Cap the wait instead: past the budget we render
// with no `initialDoctors`, which is the same path the catch already takes, and
// the carousel falls back to its client-side /api/doctors fetch.
const DOCTORS_SSR_BUDGET_MS = 2500;

// The whole roster is handed to the client, so it travels in the RSC payload
// as JSON inside the HTML. Send only the seven fields a card renders: the
// other ten columns are ~46% of those bytes and nothing reads them here.
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

export default async function Home() {
  let doctors: DoctorCard[] = [];
  try {
    doctors = mixDoctors(await doctorsWithinBudget());
  } catch {
    // The page must stay buildable without a reachable database; the carousel
    // then falls back to its client-side /api/doctors fetch.
  }
  return <HomeClient initialDoctors={doctors.length ? doctors : undefined} />;
}
