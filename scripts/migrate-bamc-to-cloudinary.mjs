/**
 * Move every doctor photo still hosted on bamc.myclinic.com.sa into Cloudinary,
 * then repoint doctors.image_url at the Cloudinary copy.
 *
 *   node scripts/migrate-bamc-to-cloudinary.mjs          # dry run
 *   node scripts/migrate-bamc-to-cloudinary.mjs --apply  # actually migrate
 *
 * Why: the legacy image server returns ~409 KB / 1182x1182 originals and takes
 * ~2.8s per photo, and it fronts 306 of the 379 doctors — it was the single
 * biggest reason doctor photos felt slow. Cloudinary serves the same image from
 * a global CDN at the width the layout actually asks for (~4 KB WebP).
 *
 * Cloudinary pulls each image itself (we hand it the bamc URL, not the bytes),
 * stores it at public_id `doctors/<slug>` — the same convention the 47 photos
 * already there use, and the one app/api/doctors/upload/route.ts writes — and we
 * rewrite image_url to the f_auto,q_auto delivery URL.
 *
 * Safe to re-run: `overwrite: false` means an asset that already exists is
 * returned rather than re-uploaded, and only rows still pointing at bamc are
 * touched. A photo that fails to migrate keeps its bamc URL and is reported —
 * the loader (app/lib/image-loader.ts) still proxies those through Cloudinary,
 * so nothing breaks either way.
 *
 * Needs CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET in .env.local.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APPLY = process.argv.includes("--apply");
const CONCURRENCY = 6;

function env() {
  const merged = {};
  for (const file of [".env", ".env.local"]) {
    try {
      for (const line of readFileSync(path.join(ROOT, file), "utf8").split("\n")) {
        const t = line.trim();
        if (!t || t.startsWith("#") || !t.includes("=")) continue;
        const i = t.indexOf("=");
        merged[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
      }
    } catch {
      /* file absent */
    }
  }
  return { ...merged, ...process.env };
}

const E = env();
const CLOUD = E.CLOUDINARY_CLOUD_NAME || "xy0ze8n9";
const KEY = E.CLOUDINARY_API_KEY;
const SECRET = E.CLOUDINARY_API_SECRET;
if (!E.DATABASE_URL) throw new Error("DATABASE_URL not set");
if (APPLY && (!KEY || !SECRET)) {
  console.error("CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET missing — add them to .env.local.");
  process.exit(1);
}

/** Cloudinary signs the alphabetically-sorted params, then appends the secret. */
function sign(params) {
  const canonical = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(canonical + SECRET).digest("hex");
}

/** Hand Cloudinary the remote URL and let it pull the bytes itself. */
async function uploadFromUrl(remoteUrl, publicId) {
  const signed = { overwrite: "false", public_id: publicId, timestamp: String(Math.floor(Date.now() / 1000)) };
  const form = new FormData();
  form.append("file", remoteUrl);
  form.append("api_key", KEY);
  for (const [k, v] of Object.entries(signed)) form.append(k, v);
  form.append("signature", sign(signed));

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: "POST",
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.public_id) {
    throw new Error(data?.error?.message || `HTTP ${res.status}`);
  }
  return data.public_id;
}

/**
 * 64 of the bamc URLs are not photographs — they are two stock images
 * (MaleDoctor.jpg / FemaleDoctor.jpg) reused across dozens of doctors. Copying
 * those into Cloudinary would just enshrine a stock portrait, so instead we
 * clear image_url and let the site's own illustrated avatar render. The filename
 * states the gender outright, which is better than the name-based guess in
 * app/lib/doctor-avatar.ts — so we record it.
 */
function placeholderGender(url) {
  if (/femaleDoctor/i.test(url)) return "female";
  if (/maleDoctor/i.test(url)) return "male";
  return null;
}

const pool = new pg.Pool({ connectionString: E.DATABASE_URL, max: 5 });
const all = (
  await pool.query(
    `select id, slug, name_en, image_url from doctors
     where image_url like 'https://bamc.myclinic.com.sa/%'
     order by name_en`
  )
).rows;

const placeholders = all.filter((r) => placeholderGender(r.image_url));
const rows = all.filter((r) => !placeholderGender(r.image_url));

console.log(`${all.length} doctors still on bamc.myclinic.com.sa`);
console.log(`  ${rows.length} real photos      → upload to Cloudinary`);
console.log(`  ${placeholders.length} stock placeholders → clear, fall back to the illustrated avatar`);

if (!all.length) {
  console.log("Nothing to migrate.");
  await pool.end();
  process.exit(0);
}
if (!APPLY) {
  console.log("\nDry run — would migrate, e.g.:");
  for (const r of rows.slice(0, 3)) {
    console.log(`  ${r.name_en}`);
    console.log(`    from ${r.image_url}`);
    console.log(`    to   https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto/doctors/${r.slug}`);
  }
  for (const r of placeholders.slice(0, 2)) {
    console.log(`  ${r.name_en}`);
    console.log(`    from ${r.image_url}`);
    console.log(`    to   (none) — gender=${placeholderGender(r.image_url)}, illustrated avatar`);
  }
  console.log(`\nRe-run with --apply.`);
  await pool.end();
  process.exit(0);
}

// Stock placeholders first — no network, just clear the photo and record gender.
for (const r of placeholders) {
  await pool.query(
    `update doctors set image_url = null, gender = coalesce(gender, $2), updated_at = now() where id = $1`,
    [r.id, placeholderGender(r.image_url)]
  );
}
console.log(`\n✓ cleared ${placeholders.length} stock placeholders`);

let done = 0;
const failures = [];

async function migrate(row) {
  try {
    const publicId = await uploadFromUrl(row.image_url, `doctors/${row.slug}`);
    const url = `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto/${publicId}`;
    await pool.query("update doctors set image_url = $2, updated_at = now() where id = $1", [row.id, url]);
    done++;
    if (done % 25 === 0) console.log(`  … ${done}/${rows.length}`);
  } catch (err) {
    // Keep the bamc URL — the loader still proxies it, so the photo keeps working.
    failures.push({ name: row.name_en, url: row.image_url, error: err.message });
  }
}

// A small pool of workers: Cloudinary is pulling each image from a slow origin,
// so this is latency-bound, but don't hammer bamc with 300 parallel requests.
const queue = [...rows];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    for (let row = queue.shift(); row; row = queue.shift()) await migrate(row);
  })
);

console.log(`\n✓ migrated ${done}/${rows.length}`);
if (failures.length) {
  console.log(`\n${failures.length} failed (left on bamc, still served via the loader's Cloudinary proxy):`);
  for (const f of failures) console.log(`   ${f.name} — ${f.error}`);
}

const left = (
  await pool.query("select count(*)::int n from doctors where image_url like '%bamc%'")
).rows[0].n;
const cld = (
  await pool.query("select count(*)::int n from doctors where image_url like '%cloudinary%'")
).rows[0].n;
console.log(`\nimage_url now: ${cld} Cloudinary · ${left} bamc`);
await pool.end();
