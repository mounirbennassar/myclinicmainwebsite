/**
 * Set a team member's dashboard password.
 *
 *   node scripts/set-admin-password.mjs someone@myclinic.com.sa
 *
 * Prompts for the password with the terminal echo turned off, so it never lands
 * in your shell history, in `ps`, or in a transcript. Writes a bcrypt hash
 * (cost 10) — the same format backend/app/security.py writes, and the format
 * app/api/auth/login/route.ts verifies, so the new password works on both the
 * Vercel deploy and the VM.
 *
 * Targets whichever database DATABASE_URL points at (.env.local = Neon, which is
 * what the live Vercel site reads).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import readline from "node:readline";
import bcrypt from "bcryptjs";
import pg from "pg";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const email = (process.argv[2] || "").trim().toLowerCase();
if (!email) {
  console.error("usage: node scripts/set-admin-password.mjs <email>");
  process.exit(1);
}

function databaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  for (const file of [".env.local", ".env"]) {
    try {
      const line = readFileSync(path.join(ROOT, file), "utf8")
        .split("\n")
        .find((l) => l.trim().startsWith("DATABASE_URL="));
      if (line) return line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
    } catch {
      /* try the next file */
    }
  }
  throw new Error("DATABASE_URL not found (env, .env.local or .env)");
}

/** Read a line without echoing it back to the terminal. */
function promptHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    const onData = (char) => {
      // Redraw the prompt without the typed characters.
      if (![`\n`, `\r`, ``].includes(char.toString())) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(question);
      }
    };
    process.stdin.on("data", onData);
    rl.question(question, (answer) => {
      process.stdin.removeListener("data", onData);
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

const pool = new pg.Pool({ connectionString: databaseUrl(), max: 2 });

const user = await pool.query(
  "select id, name, role, is_active from team_members where email = $1",
  [email]
);
if (!user.rowCount) {
  console.error(`No team member with email ${email}`);
  await pool.end();
  process.exit(1);
}
const { name, role, is_active } = user.rows[0];
console.log(`${name} · ${role}${is_active ? "" : " · INACTIVE (cannot log in)"}`);

const password = await promptHidden("New password: ");
const confirm = await promptHidden("Confirm:      ");
if (password !== confirm) {
  console.error("Passwords do not match — nothing changed.");
  await pool.end();
  process.exit(1);
}
if (password.length < 10) {
  console.error("Use at least 10 characters — nothing changed.");
  await pool.end();
  process.exit(1);
}

await pool.query(
  "update team_members set password_hash = $2, updated_at = now() where id = $1",
  [user.rows[0].id, await bcrypt.hash(password, 10)]
);

console.log(`\n✓ Password updated for ${email}. Sign in at /login.`);
await pool.end();
