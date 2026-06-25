import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// Lazy singleton. The client is created on first query — never at module load —
// so importing this file can't throw during `next build` page-data collection
// when DATABASE_URL is only present at runtime (e.g. on Vercel).
let _sql: NeonQueryFunction<false, false> | null = null;

function client(): NeonQueryFunction<false, false> {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL environment variable is not set");
    _sql = neon(url);
  }
  return _sql;
}

/**
 * Run a parameterized SQL query against Neon Postgres.
 * Use $1, $2 … placeholders (values are sent out-of-band, so this is safe from
 * SQL injection). Returns an array of row objects. Works in both the Node.js
 * (route handlers) and Edge (proxy) runtimes via Neon's HTTP driver.
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const rows = await client().query(text, params);
  return rows as T[];
}

/** Convenience: the first row of a query, or null when there are none. */
export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
