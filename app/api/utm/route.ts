import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase";

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

  const admin = getServiceSupabase();
  const { data: links, error } = await admin
    .from("utm_links")
    .select("id, slug, destination_url, source, medium, campaign, term, content, label, created_by, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
  }

  const linkIds = (links ?? []).map((l) => l.id);

  const [clicksRes, apptsRes] = await Promise.all([
    linkIds.length
      ? admin.from("utm_clicks").select("link_id, clicked_at").in("link_id", linkIds)
      : Promise.resolve({ data: [] as { link_id: string; clicked_at: string }[], error: null }),
    linkIds.length
      ? admin.from("appointments").select("utm_link_id, status").in("utm_link_id", linkIds)
      : Promise.resolve({ data: [] as { utm_link_id: string; status: string }[], error: null }),
  ]);

  const clickByLink = new Map<string, { count: number; last: string | null }>();
  for (const c of (clicksRes.data ?? []) as { link_id: string; clicked_at: string }[]) {
    const entry = clickByLink.get(c.link_id) ?? { count: 0, last: null };
    entry.count += 1;
    if (!entry.last || c.clicked_at > entry.last) entry.last = c.clicked_at;
    clickByLink.set(c.link_id, entry);
  }

  const convByLink = new Map<string, { total: number; confirmed: number }>();
  for (const a of (apptsRes.data ?? []) as { utm_link_id: string; status: string }[]) {
    if (!a.utm_link_id) continue;
    const entry = convByLink.get(a.utm_link_id) ?? { total: 0, confirmed: 0 };
    entry.total += 1;
    if (a.status === "confirmed" || a.status === "completed") entry.confirmed += 1;
    convByLink.set(a.utm_link_id, entry);
  }

  const enriched = (links ?? []).map((l) => {
    const clicks = clickByLink.get(l.id) ?? { count: 0, last: null };
    const conv = convByLink.get(l.id) ?? { total: 0, confirmed: 0 };
    return {
      ...l,
      clicks: clicks.count,
      last_click_at: clicks.last,
      conversions: conv.total,
      confirmed_conversions: conv.confirmed,
    };
  });

  return NextResponse.json({ data: enriched });
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

    const admin = getServiceSupabase();

    let slug = customSlug || generateSlug();
    for (let i = 0; i < 5; i++) {
      const { data: existing } = await admin.from("utm_links").select("id").eq("slug", slug).maybeSingle();
      if (!existing) break;
      if (customSlug) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
      }
      slug = generateSlug();
    }

    const roleLabel = role === "super_admin" ? "Super Admin" : "Admin";
    const created_by = `${userName || "Unknown"} (${roleLabel})`;

    const { data, error } = await admin
      .from("utm_links")
      .insert([{
        slug,
        destination_url,
        source,
        medium,
        campaign,
        term,
        content,
        label,
        created_by,
        created_by_id: userId,
      }])
      .select("id, slug, destination_url, source, medium, campaign, term, content, label, created_by, created_at")
      .single();

    if (error) {
      console.error("utm_links insert error:", error);
      return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
