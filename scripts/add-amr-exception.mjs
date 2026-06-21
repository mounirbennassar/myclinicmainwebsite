/**
 * Add amr.ali@inception.sa as an exception admin to team_members.
 * Run: node scripts/add-amr-exception.mjs
 */

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import crypto from "crypto";

const envFile = readFileSync(".env.local", "utf-8");
const env = {};
for (const line of envFile.split("\n")) {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) env[key.trim()] = rest.join("=").trim();
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

function generatePassword() {
  const upper = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const special = "!@#$%&*";
  const all = upper + lower + digits + special;
  const bytes = crypto.randomBytes(16);
  const password = [
    upper[bytes[0] % upper.length],
    lower[bytes[1] % lower.length],
    digits[bytes[2] % digits.length],
    special[bytes[3] % special.length],
  ];
  for (let i = 4; i < 16; i++) password.push(all[bytes[i] % all.length]);
  for (let i = password.length - 1; i > 0; i--) {
    const j = crypto.randomBytes(1)[0] % (i + 1);
    [password[i], password[j]] = [password[j], password[i]];
  }
  return password.join("");
}

const EMAIL = "amr.ali@inception.sa";
const NAME = "Amr Ali";
const ROLE = "admin";

const password = generatePassword();
const password_hash = await bcrypt.hash(password, 10);

const { data: existing } = await supabase
  .from("team_members")
  .select("id, email")
  .eq("email", EMAIL)
  .single();

let result;
if (existing) {
  const { data, error } = await supabase
    .from("team_members")
    .update({
      name: NAME,
      password_hash,
      role: ROLE,
      allowed_cities: [],
      is_active: true,
      can_export: true,
    })
    .eq("email", EMAIL)
    .select("id, email, name, role")
    .single();
  if (error) {
    console.error("Update failed:", error.message);
    process.exit(1);
  }
  result = { ...data, action: "updated" };
} else {
  const { data, error } = await supabase
    .from("team_members")
    .insert([{
      email: EMAIL,
      name: NAME,
      password_hash,
      role: ROLE,
      allowed_cities: [],
      is_active: true,
      can_export: true,
    }])
    .select("id, email, name, role")
    .single();
  if (error) {
    console.error("Insert failed:", error.message);
    process.exit(1);
  }
  result = { ...data, action: "created" };
}

console.log(`\nOK — ${result.action}\n`);
console.log(`  Email:    ${result.email}`);
console.log(`  Name:     ${result.name}`);
console.log(`  Role:     ${result.role}`);
console.log(`  Password: ${password}`);
console.log(`\nSave this password securely — it will not be shown again.\n`);
