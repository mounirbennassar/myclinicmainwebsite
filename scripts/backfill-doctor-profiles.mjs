/**
 * Backfill the fields that only ever existed in the hardcoded doctor list the
 * site used to ship (app/doctors-data.ts, generated 2026-03-26, now archived
 * beside this script) into the `doctors` table: title_ar, qualification_ar and
 * languages. Run backend/sql/003_doctor_profile_fields.sql first.
 *
 *   node scripts/backfill-doctor-profiles.mjs [--apply]
 *
 * Without --apply it is a dry run and writes nothing.
 *
 * Already applied to Neon (which the Vercel deploy reads). It still needs to be
 * run against the VM's Postgres when that host takes over — the migration adds
 * the columns there but not the data, and without it the dental strip loses its
 * Arabic titles and qualifications.
 *
 * Snapshot records are matched to DB rows on the normalized English name (174 of
 * 204 match; the other 30 are stale March entries no longer on the roster). Only
 * columns that are still NULL get written, so re-running this can never clobber
 * an edit made later in the CMS. Fields the DB already had (specialty_raw,
 * qualification_en) are deliberately left alone — they already match exactly.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APPLY = process.argv.includes("--apply");

function loadEnv() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  for (const file of [".env.local", ".env"]) {
    try {
      const line = readFileSync(path.join(ROOT, file), "utf8")
        .split("\n")
        .find((l) => l.trim().startsWith("DATABASE_URL="));
      if (line) return line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
    } catch {
      /* file absent — try the next one */
    }
  }
  throw new Error("DATABASE_URL not found (env, .env.local or .env)");
}

/** Same key on both sides: drop the honorific, then everything but [a-z0-9]. */
const normalize = (name) =>
  (name || "")
    .replace(/^\s*(dr|prof|rdh)\.?\s*/i, "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "");

const { doctorsData } = await import(path.join(ROOT, "scripts/doctors-data-2026-03-snapshot.ts"));
const pool = new pg.Pool({ connectionString: loadEnv(), max: 5 });

const dbRows = (await pool.query("select id, name_en from doctors")).rows;
const byName = new Map(dbRows.map((r) => [normalize(r.name_en), r]));

const matched = [];
const unmatched = [];
for (const d of doctorsData) {
  const row = byName.get(normalize(d.name));
  if (row) matched.push({ id: row.id, name: d.name, doctor: d });
  else unmatched.push(d);
}

console.log(`${doctorsData.length} static records · ${dbRows.length} DB rows`);
console.log(`matched ${matched.length} · unmatched ${unmatched.length}`);
if (unmatched.length) {
  console.log(`\nNot in the DB (stale March records — skipped):`);
  for (const d of unmatched) console.log(`   ${d.name} [${d.spec}]`);
}

if (!APPLY) {
  console.log(`\nDry run. Re-run with --apply to write ${matched.length} rows.`);
  await pool.end();
  process.exit(0);
}

let written = 0;
for (const { id, doctor } of matched) {
  const res = await pool.query(
    `update doctors set
       title_ar         = coalesce(title_ar, $2),
       qualification_ar = coalesce(qualification_ar, $3),
       languages        = coalesce(languages, $4),
       updated_at       = now()
     where id = $1
       and (title_ar is null or qualification_ar is null or languages is null)`,
    [
      id,
      doctor.titleAr || null,
      doctor.educationAr?.length ? doctor.educationAr.join("\n") : null,
      doctor.languages || null,
    ]
  );
  written += res.rowCount;
}

const stats = (
  await pool.query(`select
     count(*) filter (where title_ar is not null)::int         as title_ar,
     count(*) filter (where qualification_ar is not null)::int as qualification_ar,
     count(*) filter (where languages is not null)::int        as languages
   from doctors`)
).rows[0];

console.log(`\n✓ updated ${written} rows`);
console.log(`   title_ar populated:         ${stats.title_ar}`);
console.log(`   qualification_ar populated: ${stats.qualification_ar}`);
console.log(`   languages populated:        ${stats.languages}`);
await pool.end();
