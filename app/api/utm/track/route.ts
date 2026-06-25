import { NextResponse } from "next/server";
import { query, queryOne } from "@/app/lib/db";

export const dynamic = "force-dynamic";

// Public endpoint — the landing page calls this once per session when it sees
// UTM params in the URL. We resolve the UTM link (by `ref` slug or by the
// source/medium/campaign tuple) and write a row into utm_clicks. This is the
// path that fixes "0 clicks but many leads": traffic that arrives via the
// raw utm URL (bypassing /go/<slug>) used to be invisible.

const BOT_RE = /bot|crawler|spider|crawling|facebookexternalhit|preview|prerender|whatsapp|telegram|slack|linkedin/i;

async function hashIp(ip: string): Promise<string> {
  const salt = process.env.JWT_SECRET || "utm";
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function s(v: unknown, max = 100): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!t) return null;
  return t.slice(0, max);
}

export async function POST(request: Request) {
  try {
    const ua = request.headers.get("user-agent") || "";
    if (BOT_RE.test(ua)) {
      return NextResponse.json({ ok: true, skipped: "bot" });
    }

    const body = await request.json().catch(() => ({}));
    const ref = s(body?.ref, 40);
    const source = s(body?.source);
    const medium = s(body?.medium);
    const campaign = s(body?.campaign);
    const term = s(body?.term);
    const content = s(body?.content);

    // Need either a ref slug or the source+medium+campaign tuple to resolve.
    if (!ref && !(source && medium && campaign)) {
      return NextResponse.json({ ok: true, skipped: "no-utm" });
    }

    let linkId: string | null = null;

    if (ref) {
      const link = await queryOne<{ id: string }>("select id from utm_links where slug = $1", [ref]);
      if (link?.id) linkId = link.id;
    }

    if (!linkId && source && medium && campaign) {
      // Match the most-specific tuple available. Optional term/content narrow
      // the match when present so that two campaigns sharing source/medium/
      // campaign but differing on term don't collide.
      const conds = ["source = $1", "medium = $2", "campaign = $3"];
      const vals: unknown[] = [source, medium, campaign];
      if (term) { vals.push(term); conds.push(`term = $${vals.length}`); }
      if (content) { vals.push(content); conds.push(`content = $${vals.length}`); }
      const match = await queryOne<{ id: string }>(
        `select id from utm_links where ${conds.join(" and ")} order by created_at desc limit 1`,
        vals
      );
      if (match?.id) linkId = match.id;
    }

    if (!linkId) {
      return NextResponse.json({ ok: true, skipped: "no-match" });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "";
    const ip_hash = ip ? await hashIp(ip) : null;
    const referrer = s(body?.referrer, 500) || request.headers.get("referer");
    const country = request.headers.get("x-vercel-ip-country") || null;

    await query(
      "insert into utm_clicks (link_id, referrer, user_agent, ip_hash, country) values ($1, $2, $3, $4, $5)",
      [linkId, referrer, ua || null, ip_hash, country]
    );

    return NextResponse.json({ ok: true, link_id: linkId });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
