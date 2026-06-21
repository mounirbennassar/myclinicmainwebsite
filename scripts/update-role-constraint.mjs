/**
 * Update the role check constraint using Supabase Management API.
 * Run: node scripts/update-role-constraint.mjs
 */

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

// Extract project ref from URL
const projectRef = supabaseUrl.replace("https://", "").split(".")[0];

const sql = `
ALTER TABLE team_members DROP CONSTRAINT IF EXISTS team_members_role_check;
ALTER TABLE team_members ADD CONSTRAINT team_members_role_check
  CHECK (role IN ('super_admin', 'admin', 'agent'));
`;

// Use the Supabase PostgREST SQL endpoint via service role
const res = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "apikey": supabaseKey,
    "Authorization": `Bearer ${supabaseKey}`,
    "Prefer": "return=minimal",
  },
  body: JSON.stringify({ query: sql }),
});

if (!res.ok) {
  // Try the pg_net approach or direct query
  // Supabase exposes a SQL query endpoint at /pg
  const pgRes = await fetch(`https://${projectRef}.supabase.co/pg/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!pgRes.ok) {
    console.log("\nPlease run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/" + projectRef + "/sql):\n");
    console.log(sql);
    process.exit(1);
  }

  console.log("Constraint updated successfully!");
} else {
  console.log("Constraint updated successfully!");
}
