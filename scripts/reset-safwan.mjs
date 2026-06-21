/**
 * Reset Safwan's password to a strong one.
 * Run: node scripts/reset-safwan.mjs
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
  let password = [
    upper[bytes[0] % upper.length],
    lower[bytes[1] % lower.length],
    digits[bytes[2] % digits.length],
    special[bytes[3] % special.length],
  ];
  for (let i = 4; i < 16; i++) {
    password.push(all[bytes[i] % all.length]);
  }
  for (let i = password.length - 1; i > 0; i--) {
    const j = crypto.randomBytes(1)[0] % (i + 1);
    [password[i], password[j]] = [password[j], password[i]];
  }
  return password.join("");
}

const password = generatePassword();
const password_hash = await bcrypt.hash(password, 10);

const { error } = await supabase
  .from("team_members")
  .update({ password_hash })
  .eq("email", "safwan.hassan@myclinic.com.sa");

if (error) {
  console.error("Failed:", error.message);
  process.exit(1);
}

console.log(`Safwan password: ${password}`);
