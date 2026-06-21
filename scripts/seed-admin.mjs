/**
 * One-time script to create the first super_admin account.
 * Run: node scripts/seed-admin.mjs
 *
 * Before running:
 * 1. Create the team_members table in Supabase SQL Editor (see plan)
 * 2. Ensure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";

// Parse .env.local
const envFile = readFileSync(".env.local", "utf-8");
const env = {};
for (const line of envFile.split("\n")) {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) env[key.trim()] = rest.join("=").trim();
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Config — change these as needed
const ADMIN_EMAIL = "admin@myclinic.com.sa";
const ADMIN_NAME = "Super Admin";

// Generate a random password
const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
const password = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

const password_hash = await bcrypt.hash(password, 10);

const { data, error } = await supabase.from("team_members").insert([
  {
    email: ADMIN_EMAIL,
    name: ADMIN_NAME,
    password_hash,
    role: "super_admin",
    allowed_cities: [],
    is_active: true,
  },
]).select("id, email, name, role").single();

if (error) {
  console.error("Error creating admin:", error.message);
  process.exit(1);
}

console.log("\n✅ Super Admin created successfully!\n");
console.log("  Email:    ", data.email);
console.log("  Password: ", password);
console.log("  Role:     ", data.role);
console.log("\n⚠️  Save this password — it will not be shown again.\n");
