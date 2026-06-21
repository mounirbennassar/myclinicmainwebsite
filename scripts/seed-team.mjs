/**
 * Seed all team members.
 * Run: node scripts/seed-team.mjs
 *
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { readFileSync, writeFileSync } from "fs";
import crypto from "crypto";

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

// Generate a strong 16-char password
function generatePassword() {
  const upper = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const special = "!@#$%&*";
  const all = upper + lower + digits + special;

  // Ensure at least one of each type
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

  // Shuffle
  for (let i = password.length - 1; i > 0; i--) {
    const j = crypto.randomBytes(1)[0] % (i + 1);
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join("");
}

const TEAM_MEMBERS = [
  // Super Admins
  { name: "Safwan Hassan", email: "safwan.hassan@myclinic.com.sa", role: "super_admin", position: "Super Admin" },
  { name: "Haytham Elsini", email: "haytham.elsini@myclinic.com.sa", role: "super_admin", position: "Director" },

  // Admins (Leaders & Managers)
  { name: "Nariman Alayoubi", email: "nariman.alayoubi@myclinic.com.sa", role: "admin", position: "My Care Acting Manager" },
  { name: "Wejdan Shawak", email: "renad.alsaadi@myclinic.com.sa", role: "admin", position: "Leader" },
  { name: "Raad Bokhari", email: "raad.bokhari@myclinic.com.sa", role: "admin", position: "Leader" },
  { name: "Hanuf Makki", email: "hanuf.makki@myclinic.com.sa", role: "admin", position: "Leader" },
  { name: "Mahmoud Mohamed", email: "mahmoud.mohammed@myclinic.com.sa", role: "admin", position: "Leader" },
  { name: "Sara Jalaluddin", email: "sara.jalaluddin@myclinic.com.sa", role: "admin", position: "Acting Leader" },
  { name: "Hanaa Bukhari", email: "hanaa.bukhari@myclinic.com.sa", role: "admin", position: "Acting Leader" },
  { name: "AlBaraa Kinani", email: "albaraa.kinani@myclinic.com.sa", role: "admin", position: "Sr. Manager Operations & Patient Experience" },

  // Agents (Coordinators)
  { name: "Raghad Alhandi", email: "raghad.alhandi@myclinic.com.sa", role: "agent", position: "MyCare Onboarding Coordinator" },
  { name: "Wafaa Alghamdi", email: "wafaa.alghamdi@myclinic.com.sa", role: "agent", position: "MyCare Onboarding Coordinator" },
  { name: "Arwa Mohammed", email: "arwa.mohammad@myclinic.com.sa", role: "agent", position: "MyCare Onboarding Coordinator" },
  { name: "Sara Almuzayn", email: "sarah.almuzayn@myclinic.com.sa", role: "agent", position: "MyCare Onboarding Coordinator" },
];

console.log("\nSeeding team members...\n");

const results = [];

for (const member of TEAM_MEMBERS) {
  // Check if already exists
  const { data: existing } = await supabase
    .from("team_members")
    .select("id, email")
    .eq("email", member.email)
    .single();

  if (existing) {
    console.log(`  SKIP  ${member.email} (already exists)`);
    results.push({ ...member, password: "(already exists)", status: "skipped" });
    continue;
  }

  const password = generatePassword();
  const password_hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("team_members")
    .insert([{
      email: member.email,
      name: member.name,
      password_hash,
      role: member.role,
      allowed_cities: member.role === "agent" ? ["Jeddah", "Riyadh"] : [],
      is_active: true,
      can_export: member.role !== "agent",
    }])
    .select("id, email, name, role")
    .single();

  if (error) {
    console.error(`  FAIL  ${member.email}: ${error.message}`);
    results.push({ ...member, password: "FAILED", status: "error" });
  } else {
    console.log(`  OK    ${data.email} (${data.role})`);
    results.push({ ...member, password, status: "created" });
  }
}

// Generate markdown table
const mdLines = [
  "# MyCare Team Credentials",
  "",
  `Generated: ${new Date().toISOString().split("T")[0]}`,
  "",
  "| # | Name | Position | Email | Role | Password |",
  "|---|------|----------|-------|------|----------|",
];

results.forEach((r, i) => {
  mdLines.push(
    `| ${i + 1} | ${r.name} | ${r.position} | ${r.email} | ${r.role} | \`${r.password}\` |`
  );
});

mdLines.push("");
mdLines.push("> **IMPORTANT:** Share passwords securely and ask users to change them on first login.");
mdLines.push("");

const mdContent = mdLines.join("\n");
writeFileSync("team-credentials.md", mdContent);

console.log("\n" + "=".repeat(60));
console.log("Results saved to team-credentials.md");
console.log("=".repeat(60));

// Also print table to console
console.log("\n" + mdLines.slice(4).join("\n") + "\n");
