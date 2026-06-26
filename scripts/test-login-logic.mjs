import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";

const env = {};
for (const l of readFileSync(".env.local", "utf-8").split("\n")) {
  const i = l.indexOf("=");
  if (i > 0 && !l.trimStart().startsWith("#")) env[l.slice(0, i).trim()] = l.slice(i + 1).trim();
}

console.log("DATABASE_URL set:", !!env.DATABASE_URL);
console.log("JWT_SECRET set:", !!env.JWT_SECRET, "| length:", (env.JWT_SECRET || "").length);

const sql = neon(env.DATABASE_URL);
const [u] = await sql.query("select * from team_members where role = $1 limit 1", ["super_admin"]);
console.log("1. DB user lookup:", u ? `OK (${u.email})` : "NO USER");

const secret = new TextEncoder().encode(env.JWT_SECRET);
const token = await new SignJWT({ sub: u.id, email: u.email, name: u.name, role: u.role })
  .setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret);
console.log("2. signToken:", token ? `OK (jwt length ${token.length})` : "FAIL");

const cmp = await bcrypt.compare("definitely-wrong-password", u.password_hash);
console.log("3. bcrypt.compare(wrong):", cmp, "(expected false, no throw)");

console.log("\n→ If all 3 pass, the login CODE is correct; a 400 in the browser means the RUNTIME env (Vercel or a stale `next dev`) is missing DATABASE_URL / JWT_SECRET.");
