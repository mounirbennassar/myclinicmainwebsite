import { NextResponse } from "next/server";
import { query, queryOne } from "@/app/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

type UtmLink = {
  id: string;
  slug: string;
  destination_url: string;
  source: string;
  medium: string;
  campaign: string;
  term: string | null;
  content: string | null;
};

function buildDestination(link: UtmLink): string {
  try {
    const url = new URL(link.destination_url);
    url.searchParams.set("utm_source", link.source);
    url.searchParams.set("utm_medium", link.medium);
    url.searchParams.set("utm_campaign", link.campaign);
    if (link.term) url.searchParams.set("utm_term", link.term);
    if (link.content) url.searchParams.set("utm_content", link.content);
    url.searchParams.set("utm_ref", link.slug);
    return url.toString();
  } catch {
    return link.destination_url;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const link = await queryOne<UtmLink>(
    "select id, slug, destination_url, source, medium, campaign, term, content from utm_links where slug = $1",
    [slug]
  );

  if (!link) {
    return NextResponse.redirect(new URL("/", request.url), { status: 302 });
  }

  const headers = request.headers;
  const ip =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "";
  const ip_hash = ip ? await hashIp(ip) : null;
  const referrer = headers.get("referer") || null;
  const user_agent = headers.get("user-agent") || null;
  const country = headers.get("x-vercel-ip-country") || null;

  // Skip bot/preview crawlers so the click count reflects real users only.
  const isBot = user_agent ? BOT_RE.test(user_agent) : false;
  if (!isBot) {
    await query(
      "insert into utm_clicks (link_id, referrer, user_agent, ip_hash, country) values ($1, $2, $3, $4, $5)",
      [link.id, referrer, user_agent, ip_hash, country]
    );
  }

  const res = NextResponse.redirect(buildDestination(link), { status: 302 });
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  return res;
}
