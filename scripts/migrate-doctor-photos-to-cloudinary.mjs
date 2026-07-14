/**
 * Consolidate every doctor photo onto My Clinic's official Cloudinary cloud, and
 * repoint doctors.image_url at it.
 *
 *   node scripts/migrate-doctor-photos-to-cloudinary.mjs          # dry run
 *   node scripts/migrate-doctor-photos-to-cloudinary.mjs --apply
 *
 * Photos used to be spread across two other hosts:
 *
 *   bamc.myclinic.com.sa            the clinic's legacy image server — ~409 KB /
 *                                   1182x1182 originals, ~2.8s to fetch, and it
 *                                   fronted most of the roster.
 *   res.cloudinary.com/<old cloud>  an earlier Cloudinary account.
 *
 * Both are copied into the cloud named by CLOUDINARY_CLOUD_NAME at public_id
 * `doctors/<slug>` — Cloudinary pulls each image itself, we only hand it the
 * source URL — and image_url is rewritten to the f_auto,q_auto delivery URL.
 * app/lib/image-loader.ts then requests each one at the width it renders at.
 *
 * Doctors whose "photo" is really a shared MaleDoctor.jpg / FemaleDoctor.jpg
 * stock placeholder are NOT copied: image_url is cleared so the site's own
 * illustrated avatar renders, and gender is taken from the filename (which says
 * it outright, unlike the name-based guess in app/lib/doctor-avatar.ts).
 *
 * Safe to re-run: `overwrite: false` returns an existing asset rather than
 * re-uploading, and only rows not already on the target cloud are touched. A
 * photo that fails keeps its current URL and is reported.
 *
 * Needs CLOUDINARY_CLOUD_NAME / _API_KEY / _API_SECRET in .env.local.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
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
const CLOUD = E.CLOUDINARY_CLOUD_NAME;
const KEY = E.CLOUDINARY_API_KEY;
const SECRET = E.CLOUDINARY_API_SECRET;
if (!E.DATABASE_URL) throw new Error("DATABASE_URL not set");
if (!CLOUD) throw new Error("CLOUDINARY_CLOUD_NAME not set");
if (APPLY && (!KEY || !SECRET)) {
  console.error("CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET missing — add them to .env.local.");
  process.exit(1);
}

const TARGET_PREFIX = `https://res.cloudinary.com/${CLOUD}/`;

/** Cloudinary signs the alphabetically-sorted params, then appends the secret. */
function sign(params) {
  const canonical = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(canonical + SECRET).digest("hex");
}

/**
 * Upload to Cloudinary. `source` is either a remote URL (Cloudinary pulls the
 * bytes itself) or a local file read off disk — some doctors' image_url is a
 * repo-relative path like /doctors/dr-x.webp, which Cloudinary cannot fetch.
 */
async function upload(source, publicId) {
  const signed = {
    overwrite: "false",
    public_id: publicId,
    timestamp: String(Math.floor(Date.now() / 1000)),
  };
  const form = new FormData();
  if (typeof source === "string") form.append("file", source);
  else form.append("file", new Blob([source.bytes]), source.filename);
  form.append("api_key", KEY);
  for (const [k, v] of Object.entries(signed)) form.append(k, v);
  form.append("signature", sign(signed));

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: "POST",
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.public_id) throw new Error(data?.error?.message || `HTTP ${res.status}`);
  return data.public_id;
}

/** Two stock images stand in for dozens of doctors; the filename gives the gender. */
function placeholderGender(url) {
  if (/femaleDoctor/i.test(url)) return "female";
  if (/maleDoctor/i.test(url)) return "male";
  return null;
}

/**
 * What to copy FROM: a remote URL string, a local file, or null when the source
 * no longer exists (a doctor whose bamc URL 404s — there is nothing to migrate,
 * so the photo gets cleared and the illustrated avatar takes over).
 *
 * For an old-Cloudinary asset, strip the transformation so we pull the untouched
 * original instead of re-encoding an already-compressed derivative.
 */
function resolveSource(imageUrl) {
  // Repo-relative path — the file lives in public/.
  if (imageUrl.startsWith("/")) {
    const file = path.join(ROOT, "public", imageUrl);
    if (!existsSync(file)) return null;
    return { bytes: readFileSync(file), filename: path.basename(file) };
  }

  const m = imageUrl.match(/^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/);
  if (!m) return imageUrl;
  const [, base, rest] = m;
  const segments = rest.split("/");
  if (segments.length > 1 && /^[a-z]+_[^/,]+(?:,[a-z]+_[^/,]+)*$/.test(segments[0])) segments.shift();
  return base + segments.join("/");
}

const describe = (s) => (typeof s === "string" ? s : s ? `${s.filename} (local file)` : "(missing)");

const pool = new pg.Pool({ connectionString: E.DATABASE_URL, max: 5 });
const all = (
  await pool.query(
    `select id, slug, name_en, image_url from doctors
      where image_url is not null and image_url <> '' and image_url not like $1
      order by name_en`,
    [`${TARGET_PREFIX}%`]
  )
).rows;

const placeholders = all.filter((r) => placeholderGender(r.image_url));
const rows = all.filter((r) => !placeholderGender(r.image_url));
const alreadyThere = (
  await pool.query(`select count(*)::int n from doctors where image_url like $1`, [`${TARGET_PREFIX}%`])
).rows[0].n;

console.log(`target cloud: ${CLOUD}  (${alreadyThere} doctors already on it)`);
console.log(`${all.length} doctors to move:`);
console.log(`  ${rows.length} real photos      → copy to ${CLOUD}`);
console.log(`  ${placeholders.length} stock placeholders → clear, fall back to the illustrated avatar`);

if (!all.length) {
  console.log("\nNothing to do — every doctor photo is already on the target cloud.");
  await pool.end();
  process.exit(0);
}

if (!APPLY) {
  console.log("\nDry run — would migrate, e.g.:");
  for (const r of rows.slice(0, 3)) {
    console.log(`  ${r.name_en}`);
    console.log(`    from ${describe(resolveSource(r.image_url))}`);
    console.log(`    to   ${TARGET_PREFIX}image/upload/f_auto,q_auto/doctors/${r.slug}`);
  }
  for (const r of placeholders.slice(0, 2)) {
    console.log(`  ${r.name_en}  → cleared (gender=${placeholderGender(r.image_url)})`);
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
let dropped = 0;
const failures = [];

async function migrate(row) {
  const source = resolveSource(row.image_url);

  // The source is gone (a dead bamc URL, a missing local file). Keeping a URL
  // that 404s just renders a broken image — clear it and let the illustrated
  // avatar do its job.
  if (source === null) {
    await pool.query(
      "update doctors set image_url = null, updated_at = now() where id = $1",
      [row.id]
    );
    dropped++;
    return;
  }

  try {
    const publicId = await upload(source, `doctors/${row.slug}`);
    const url = `${TARGET_PREFIX}image/upload/f_auto,q_auto/${publicId}`;
    await pool.query("update doctors set image_url = $2, updated_at = now() where id = $1", [row.id, url]);
    done++;
    if (done % 25 === 0) console.log(`  … ${done}/${rows.length}`);
  } catch (err) {
    // Cloudinary could not fetch the source at all, so the URL in the DB is a
    // dead link and would render as a broken image forever. Clear it.
    if (/resource not found|404/i.test(err.message)) {
      await pool.query("update doctors set image_url = null, updated_at = now() where id = $1", [row.id]);
      dropped++;
      return;
    }
    // Anything else (a transient network blip) — leave the old URL alone so the
    // photo keeps working, and re-run the script later.
    failures.push({ name: row.name_en, source: describe(source), error: err.message });
  }
}

const queue = [...rows];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    for (let row = queue.shift(); row; row = queue.shift()) await migrate(row);
  })
);

console.log(`\n✓ copied ${done}/${rows.length} photos to ${CLOUD}`);
if (dropped) console.log(`✓ cleared ${dropped} whose source no longer exists → illustrated avatar`);
if (failures.length) {
  console.log(`\n${failures.length} failed (left on their old host):`);
  for (const f of failures) console.log(`   ${f.name} — ${f.error}\n      source: ${f.source}`);
}

const stats = (
  await pool.query(
    `select
       count(*) filter (where image_url like $1)::int as on_target,
       count(*) filter (where image_url like '%bamc%')::int as bamc,
       count(*) filter (where image_url like '%cloudinary%' and image_url not like $1)::int as other_cloud,
       count(*) filter (where image_url is null or image_url = '')::int as no_photo
     from doctors`,
    [`${TARGET_PREFIX}%`]
  )
).rows[0];
console.log(`\nimage_url now:`);
console.log(`   ${stats.on_target} on ${CLOUD}`);
console.log(`   ${stats.bamc} still on bamc`);
console.log(`   ${stats.other_cloud} on another Cloudinary cloud`);
console.log(`   ${stats.no_photo} no photo (illustrated avatar)`);
await pool.end();
