/**
 * One-time data migration: Supabase → Neon Postgres.
 *
 * Reads every row from each table via the Supabase REST API (service key) and
 * inserts into Neon, preserving ids/timestamps. Idempotent (ON CONFLICT id DO
 * NOTHING) so it can be re-run safely. Tables are copied in FK-dependency order.
 *
 * Run: node scripts/migrate-supabase-to-neon.mjs
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 * and DATABASE_URL (Neon).
 */
import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";

// ── env ───────────────────────────────────────────────────────────────────
const env = {};
for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
  const i = line.indexOf("=");
  if (i > 0 && !line.trimStart().startsWith("#")) env[line.slice(0, i).trim()] = line.slice(i + 1).trim();
}
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const DATABASE_URL = env.DATABASE_URL;
if (!SUPABASE_URL || !SERVICE_KEY || !DATABASE_URL) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / DATABASE_URL in .env.local");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// Column lists per table (target schema). Order matters for inserts.
const TABLES = [
  { name: "team_members", cols: ["id","email","name","password_hash","role","allowed_cities","is_active","can_export","created_at","updated_at"] },
  { name: "utm_links",    cols: ["id","slug","destination_url","source","medium","campaign","term","content","label","created_by","created_by_id","created_at"] },
  { name: "appointments", cols: ["id","created_at","city","name","phone","channel","note","vertical","service","created_by","status","status_changed_by","status_changed_at","assigned_to","assigned_to_name","utm_source","utm_medium","utm_campaign","utm_term","utm_content","utm_link_id","referrer"] },
  { name: "utm_clicks",   cols: ["id","link_id","clicked_at","referrer","user_agent","ip_hash","country"] },
];

// ── read all rows from Supabase REST (paginated) ───────────────────────────
async function fetchAll(table) {
  const headers = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, Accept: "application/json" };
  const limit = 1000;
  let offset = 0;
  const all = [];
  for (;;) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=*&order=id.asc&limit=${limit}&offset=${offset}`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Supabase read ${table} failed: ${res.status} ${await res.text()}`);
    const rows = await res.json();
    all.push(...rows);
    if (rows.length < limit) break;
    offset += limit;
  }
  return all;
}

function pgArrayLiteral(value) {
  const arr = Array.isArray(value) ? value : value == null ? [] : [value];
  return `{${arr.map((x) => `"${String(x).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`).join(",")}}`;
}

// ── insert into Neon (batched, parameterized, idempotent) ──────────────────
async function insertRows(table, cols, rows) {
  if (!rows.length) return 0;
  const CHUNK = 200;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const params = [];
    const tuples = chunk.map((row) => {
      const ph = cols.map((col) => {
        let v = row[col];
        if (v === undefined) v = null;
        if (col === "allowed_cities") {
          params.push(pgArrayLiteral(v));
          return `$${params.length}::text[]`;
        }
        params.push(v);
        return `$${params.length}`;
      });
      return `(${ph.join(",")})`;
    });
    const text = `insert into ${table} (${cols.join(",")}) values ${tuples.join(",")} on conflict (id) do nothing`;
    await sql.query(text, params);
  }
  return rows.length;
}

// ── run ────────────────────────────────────────────────────────────────────
console.log("\nMigrating Supabase → Neon…\n");
for (const { name, cols } of TABLES) {
  process.stdout.write(`  ${name.padEnd(14)} `);
  try {
    const rows = await fetchAll(name);
    await insertRows(name, cols, rows);
    const [{ count }] = await sql.query(`select count(*)::int as count from ${name}`);
    console.log(`read ${String(rows.length).padStart(6)} · now in Neon: ${count}`);
  } catch (e) {
    console.log(`FAILED: ${e.message}`);
    process.exit(1);
  }
}
console.log("\n✓ Data migration complete.\n");
