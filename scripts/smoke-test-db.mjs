/**
 * Quick read-only sanity check that the migrated Neon data answers the same
 * query shapes the app uses. Run: node scripts/smoke-test-db.mjs
 */
import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";

const env = {};
for (const l of readFileSync(".env.local", "utf-8").split("\n")) {
  const i = l.indexOf("=");
  if (i > 0 && !l.trimStart().startsWith("#")) env[l.slice(0, i).trim()] = l.slice(i + 1).trim();
}
const sql = neon(env.DATABASE_URL);

const [u] = await sql.query(
  "select email, role, allowed_cities, is_active, can_export, password_hash from team_members where role = $1 limit 1",
  ["super_admin"]
);
console.log("1. login → super_admin:", u.email, "| bcrypt:", u.password_hash?.startsWith("$2") ? "valid" : "BAD",
  "| cities:", JSON.stringify(u.allowed_cities), "| active:", u.is_active);

const [t] = await sql.query("select count(*)::int c from appointments");
const [f] = await sql.query("select count(*)::int c from appointments where city = ANY($1::text[])", [["Jeddah", "Riyadh"]]);
console.log("2. appointments total:", t.c, "| in Jeddah+Riyadh:", f.c);

const [o] = await sql.query("select count(*)::int c from team_members where allowed_cities && $1::text[]", [["Jeddah"]]);
console.log("3. team overlapping Jeddah:", o.c, "members");

const links = await sql.query("select id from utm_links order by created_at desc limit 5");
const ids = links.map((l) => l.id);
const [c] = await sql.query("select count(*)::int c from utm_clicks where link_id = ANY($1::uuid[])", [ids]);
const [a] = await sql.query("select count(*)::int c from appointments where utm_link_id is not null");
console.log("4. utm attribution → clicks(5 newest links):", c.c, "| attributed leads:", a.c);

const st = await sql.query("select coalesce(status, '(null)') s, count(*)::int c from appointments group by status order by c desc limit 6");
console.log("5. lead statuses:", st.map((r) => `${r.s}=${r.c}`).join(", "));

console.log("\nAll query patterns work against migrated Neon data.");
