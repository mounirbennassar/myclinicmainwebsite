/**
 * Fix roles: change specific members from admin to agent.
 * Run: node scripts/fix-roles.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const envFile = readFileSync(".env.local", "utf-8");
const env = {};
for (const line of envFile.split("\n")) {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) env[key.trim()] = rest.join("=").trim();
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const EMAILS_TO_FIX = [
  "sara.jalaluddin@myclinic.com.sa",
  "hanaa.bukhari@myclinic.com.sa",
  "raghad.alhandi@myclinic.com.sa",
  "wafaa.alghamdi@myclinic.com.sa",
  "arwa.mohammad@myclinic.com.sa",
  "sarah.almuzayn@myclinic.com.sa",
  "albaraa.kinani@myclinic.com.sa",
];

for (const email of EMAILS_TO_FIX) {
  const { error } = await supabase
    .from("team_members")
    .update({ role: "agent", allowed_cities: ["Jeddah", "Riyadh"] })
    .eq("email", email);

  if (error) {
    console.error(`FAIL  ${email}: ${error.message}`);
  } else {
    console.log(`OK    ${email} → agent`);
  }
}

console.log("\nDone.");
