import { revalidatePath } from "next/cache";

/**
 * Cross-container cache purging.
 *
 * `web` and `portal` are two containers running the same image, each with its
 * OWN .next cache. A dashboard edit lands in whichever container served the
 * request (normally portal), and `revalidatePath()` only purges THAT process —
 * the sibling kept serving stale HTML until its 300s ISR timer fired. That is
 * the "I changed it but the site still shows the old thing" gap this module
 * closes: after purging locally, every mutation also POSTs to the peers listed
 * in REVALIDATE_PEERS (set per-container in docker-compose.yml), whose
 * /api/revalidate route runs the same purge in their process.
 *
 * The FastAPI backend does the same for CMS content — see
 * backend/app/revalidate.py, the Python twin of the broadcast half.
 */

const PEERS = (process.env.REVALIDATE_PEERS || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

/** Purge this container's cache: the whole route tree plus any named paths. */
export function purgeLocal(paths: string[] = []): void {
  // Doctors surface on the home carousel, /find-doctor, /specialties, every
  // /doctors/[slug], and the dental + pediatric strips — all ISR'd. Purge the
  // whole route cache rather than enumerate them: an admin edit is rare, and
  // missing a page here is exactly the staleness bug this exists to kill.
  revalidatePath("/", "layout");
  // The blanket purge already covers these, but the edited record's own page
  // is the one an editor checks first, so it is worth naming explicitly
  // rather than leaving it to a wildcard someone may later narrow.
  for (const path of paths) revalidatePath(path);
}

/** Ask every peer container to run the same purge. Never throws: a peer being
 *  down must degrade to "stale for ≤300s there" — not fail the user's save. */
export async function broadcastRevalidate(paths: string[] = []): Promise<void> {
  if (!PEERS.length) return; // local dev / single-container: nothing to do
  const key = process.env.REVALIDATE_SECRET || process.env.JWT_SECRET;
  if (!key) return;

  await Promise.allSettled(
    PEERS.map(async (origin) => {
      try {
        const res = await fetch(`${origin}/api/revalidate`, {
          method: "POST",
          headers: { "content-type": "application/json", "x-revalidate-key": key },
          body: JSON.stringify({ paths }),
          signal: AbortSignal.timeout(3000),
        });
        if (!res.ok) console.warn(`revalidate peer ${origin} answered ${res.status}`);
      } catch (err) {
        console.warn(`revalidate peer ${origin} unreachable:`, err);
      }
    })
  );
}

/** Purge doctor-facing pages here and on every peer container. */
export async function revalidateDoctorPages(slug?: string | null): Promise<void> {
  const paths = slug ? [`/doctors/${slug}`] : [];
  purgeLocal(paths);
  await broadcastRevalidate(paths);
}
