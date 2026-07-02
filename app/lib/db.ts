import { Pool } from "pg";

// Lazy singleton. The pool is created on first query — never at module load —
// so importing this file can't throw during `next build` page-data collection
// when DATABASE_URL is only present at runtime.
//
// Works against any Postgres: the Docker `db` service in production
// (postgresql://…@db:5432/…, no TLS) or a cloud instance like Neon
// (…?sslmode=require — pg reads sslmode from the connection string).
let _pool: Pool | null = null;

function pool(): Pool {
  if (!_pool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL environment variable is not set");
    _pool = new Pool({ connectionString: url, max: 5 });
  }
  return _pool;
}

/**
 * Run a parameterized SQL query. Use $1, $2 … placeholders (values are sent
 * out-of-band, so this is safe from SQL injection). Returns row objects.
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await pool().query(text, params);
  return result.rows as T[];
}

/** Convenience: the first row of a query, or null when there are none. */
export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
