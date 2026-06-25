import { NextResponse } from "next/server";
import { query, queryOne } from "@/app/lib/db";

function generateSlug(length = 6): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => chars[b % chars.length]).join("");
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export async function GET(request: Request) {
  const role = request.headers.get("x-user-role");
  if (role !== "super_admin" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const links = await query<{ id: string }>(
      "select id, slug, destination_url, source, medium, campaign, term, content, label, created_by, created_at from utm_links order by created_at desc"
    );

    const linkIds = links.map((l) => l.id);

    const [clicks, appts] = await Promise.all([
      linkIds.length
        ? query<{ link_id: string; clicked_at: string }>(
            "select link_id, clicked_at from utm_clicks where link_id = ANY($1::uuid[])",
            [linkIds]
          )
        : Promise.resolve([] as { link_id: string; clicked_at: string }[]),
      linkIds.length
        ? query<{ utm_link_id: string; status: string }>(
            "select utm_link_id, status from appointments where utm_link_id = ANY($1::uuid[])",
            [linkIds]
          )
        : Promise.resolve([] as { utm_link_id: string; status: string }[]),
    ]);

    const clickByLink = new Map<string, { count: number; last: string | null }>();
    for (const c of clicks) {
      const entry = clickByLink.get(c.link_id) ?? { count: 0, last: null };
      entry.count += 1;
      if (!entry.last || c.clicked_at > entry.last) entry.last = c.clicked_at;
      clickByLink.set(c.link_id, entry);
    }

    const convByLink = new Map<string, { total: number; confirmed: number }>();
    for (const a of appts) {
      if (!a.utm_link_id) continue;
      const entry = convByLink.get(a.utm_link_id) ?? { total: 0, confirmed: 0 };
      entry.total += 1;
      if (a.status === "confirmed" || a.status === "completed") entry.confirmed += 1;
      convByLink.set(a.utm_link_id, entry);
    }

    const enriched = links.map((l) => {
      const clicksEntry = clickByLink.get(l.id) ?? { count: 0, last: null };
      const conv = convByLink.get(l.id) ?? { total: 0, confirmed: 0 };
      return {
        ...l,
        clicks: clicksEntry.count,
        last_click_at: clicksEntry.last,
        conversions: conv.total,
        confirmed_conversions: conv.confirmed,
      };
    });

    return NextResponse.json({ data: enriched });
  } catch {
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const role = request.headers.get("x-user-role");
  const userId = request.headers.get("x-user-id");
  const userName = request.headers.get("x-user-name");

  if (role !== "super_admin" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const destination_url = String(body.destination_url ?? "").trim();
    const source = String(body.source ?? "").trim();
    const medium = String(body.medium ?? "").trim();
    const campaign = String(body.campaign ?? "").trim();
    const term = body.term ? String(body.term).trim() : null;
    const content = body.content ? String(body.content).trim() : null;
    const label = body.label ? String(body.label).trim() : null;
    const customSlug = body.slug ? slugify(String(body.slug)) : null;

    if (!destination_url || !source || !medium || !campaign) {
      return NextResponse.json({ error: "destination_url, source, medium, campaign are required" }, { status: 400 });
    }

    try {
      new URL(destination_url);
    } catch {
      return NextResponse.json({ error: "Invalid destination URL" }, { status: 400 });
    }

    let slug = customSlug || generateSlug();
    for (let i = 0; i < 5; i++) {
      const existing = await queryOne("select id from utm_links where slug = $1", [slug]);
      if (!existing) break;
      if (customSlug) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
      }
      slug = generateSlug();
    }

    const roleLabel = role === "super_admin" ? "Super Admin" : "Admin";
    const created_by = `${userName || "Unknown"} (${roleLabel})`;

    const data = await queryOne(
      `insert into utm_links (slug, destination_url, source, medium, campaign, term, content, label, created_by, created_by_id)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       returning id, slug, destination_url, source, medium, campaign, term, content, label, created_by, created_at`,
      [slug, destination_url, source, medium, campaign, term, content, label, created_by, userId]
    );

    return NextResponse.json({ data });
  } catch (err) {
    console.error("utm_links insert error:", err);
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
  }
}
