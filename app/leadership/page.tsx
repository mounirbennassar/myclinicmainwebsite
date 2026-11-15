import { createHash, timingSafeEqual } from "node:crypto";
import { notFound } from "next/navigation";
import LeadershipClient from "./LeadershipClient";

// PREVIEW GATE — the page only renders for /leadership?key=<preview key>;
// every other request gets the site's 404, so the page does not appear to exist.
// Only the SHA-256 of the key is stored because this repo is public. To rotate,
// hash a new key (`printf %s NEWKEY | shasum -a 256`) and replace the value.
// Delete this gate (render <LeadershipClient /> directly) at launch.
const PREVIEW_KEY_SHA256 = "5e8d5256b1c4d8759147b89949486287a6b7990a6b978428da3e4e65d5ea00c8";

function keyMatches(key: string): boolean {
  const given = createHash("sha256").update(key).digest();
  return timingSafeEqual(given, Buffer.from(PREVIEW_KEY_SHA256, "hex"));
}

export default async function LeadershipPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { key } = await searchParams;
  if (typeof key !== "string" || !keyMatches(key)) notFound();
  return <LeadershipClient />;
}
