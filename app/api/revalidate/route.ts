import { createHash, timingSafeEqual } from "node:crypto";
import { purgeLocal } from "@/app/lib/revalidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Internal cache-purge endpoint — the receiving half of cross-container
 * revalidation (see app/lib/revalidation.ts). Called by the sibling Next
 * container and by the FastAPI backend after CMS mutations; never by browsers.
 *
 * Auth is a shared secret (REVALIDATE_SECRET, falling back to JWT_SECRET so no
 * new env var is required) — NOT the session cookie, because the callers are
 * server processes without one. This route only ever purges caches, so the
 * worst an attacker with the secret could do is force re-renders.
 */

/** Compare via digests so length differences don't short-circuit timing. */
function keyMatches(given: string, expected: string): boolean {
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET || process.env.JWT_SECRET;
  if (!expected) {
    return Response.json({ error: "Revalidation is not configured" }, { status: 503 });
  }
  const given = request.headers.get("x-revalidate-key") || "";
  if (!keyMatches(given, expected)) {
    return Response.json({ error: "Invalid revalidation key" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  // Literal paths only ("/doctors/foo") — the blanket layout purge inside
  // purgeLocal() covers everything else, so a malformed entry is dropped, not
  // an error. No broadcast from here: peers call each other directly, and
  // re-broadcasting would ping-pong forever.
  const paths = (Array.isArray(body?.paths) ? body.paths : [])
    .filter((p: unknown): p is string => typeof p === "string" && p.startsWith("/") && p.length < 1024)
    .slice(0, 32);

  purgeLocal(paths);
  return Response.json({ revalidated: true, paths });
}
