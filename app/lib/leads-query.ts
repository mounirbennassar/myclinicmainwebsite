import type { CurrentUser } from "./auth";
import { query } from "./db";
import { LEAD_ALL_ROLES, hasRole } from "./roles";

/**
 * The lead list query behind GET /api/appointments.
 *
 * Filtering, paging and the stat counts all happen in SQL. The portal used to
 * download every lead (5 MB, 10k rows, every 30 seconds) and filter in the
 * browser; at 100–250 new leads a day that only got slower. Now a table page
 * is one round-trip of ~50 rows plus a handful of counts, and only the export
 * modes are unbounded (and those are gzipped — see gzip-json.ts).
 *
 * Two layers of predicates, and the split is deliberate:
 *   scope       what this member may see at all (role + cities + own leads)
 *   structural  the segment being looked at: vertical, service, city, agent,
 *               date range. The stat cards and the "of Y" denominator count
 *               over scope + structural only.
 *   transient   status + free-text search. These narrow the TABLE (and the
 *               "X of" numerator) but not the cards, so while an agent
 *               searches or filters by status the Pending / Booked cards keep
 *               showing the full breakdown of the segment.
 * Indexes for all of this live in backend/sql/007_leads_list_indexes.sql.
 */

export const LEAD_VERTICALS = ["medical", "dental", "pediatric", "my360"] as const;

export const LEAD_LIST_MODES = ["table", "export", "report", "ids"] as const;
export type LeadListMode = (typeof LEAD_LIST_MODES)[number];

export const LEAD_LIST_DEFAULT_SIZE = 50;
export const LEAD_LIST_MAX_SIZE = 500;
// Beyond this the offset is meaningless; it only bounds what a bad URL can ask for.
const LEAD_LIST_MAX_PAGE = 100_000;

export type LeadListParams = {
  mode: LeadListMode;
  page: number;
  size: number;
  vertical: string | null;
  service: string | null;
  city: string | null;
  status: string | null;
  /** A team member uuid, or the literal "unassigned". */
  agent: string | null;
  q: string | null;
  from: Date | null;
  to: Date | null;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const text = (v: string | null, max: number): string | null => {
  const t = (v ?? "").trim();
  return t ? t.slice(0, max) : null;
};
const int = (v: string | null, fallback: number): number => {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) ? n : fallback;
};
const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);
const date = (v: string | null): Date | null => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

/**
 * Read and sanitise the query string. Every value is optional, clamped, and an
 * unknown value is ignored rather than rejected — a stale bookmark or a typo
 * must never turn the portal into an error page.
 */
export function parseLeadListParams(sp: URLSearchParams): LeadListParams {
  const modeRaw = sp.get("mode") ?? "";
  const verticalRaw = sp.get("vertical") ?? "";
  const agentRaw = text(sp.get("agent"), 40);
  return {
    mode: (LEAD_LIST_MODES as readonly string[]).includes(modeRaw) ? (modeRaw as LeadListMode) : "table",
    page: clamp(int(sp.get("page"), 1), 1, LEAD_LIST_MAX_PAGE),
    size: clamp(int(sp.get("size"), LEAD_LIST_DEFAULT_SIZE), 1, LEAD_LIST_MAX_SIZE),
    vertical: (LEAD_VERTICALS as readonly string[]).includes(verticalRaw) ? verticalRaw : null,
    service: text(sp.get("service"), 100),
    city: text(sp.get("city"), 100),
    status: text(sp.get("status"), 50),
    agent: agentRaw === "unassigned" || (agentRaw !== null && UUID_RE.test(agentRaw)) ? agentRaw : null,
    q: text(sp.get("q"), 100),
    from: date(sp.get("from")),
    to: date(sp.get("to")),
  };
}

/** A WHERE clause under construction: conditions plus their positional params. */
export class SqlWhere {
  readonly conds: string[] = [];
  readonly params: unknown[] = [];

  /** Register a value and get back its `$n` placeholder. */
  bind(value: unknown): string {
    this.params.push(value);
    return `$${this.params.length}`;
  }

  add(cond: string): this {
    this.conds.push(cond);
    return this;
  }

  clone(): SqlWhere {
    const w = new SqlWhere();
    w.conds.push(...this.conds);
    w.params.push(...this.params);
    return w;
  }

  get sql(): string {
    return this.conds.length ? `where ${this.conds.join(" and ")}` : "";
  }
}

/**
 * The role scope: super_admin sees everything; everyone else only their
 * allowed cities; and a plain agent only the leads assigned to them.
 * Returns null when the member can see nothing at all (a city-scoped role with
 * no cities), which every mode answers with an empty result.
 */
export function leadScope(user: CurrentUser): SqlWhere | null {
  const w = new SqlWhere();
  if (hasRole(user.roles, "super_admin")) return w;
  if (!user.allowed_cities.length) return null;
  w.add(`city = ANY(${w.bind(user.allowed_cities)}::text[])`);
  // Own-leads-only is what `agent` means, and it survives being paired with a
  // non-lead role like content_manager. Pairing it with admin lifts it —
  // that's the whole point of granting both.
  if (hasRole(user.roles, "agent") && !hasRole(user.roles, ...LEAD_ALL_ROLES)) {
    w.add(`assigned_to = ${w.bind(user.id)}::uuid`);
  }
  return w;
}

/** LIKE wildcards typed into the search box are literal characters, not patterns. */
const escapeLike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

function addStructuralFilters(w: SqlWhere, p: LeadListParams): void {
  // Legacy rows carry a NULL vertical and belong to the medical view; the
  // expression matches appointments_vertical_created_idx exactly.
  if (p.vertical) w.add(`coalesce(vertical, 'medical') = ${w.bind(p.vertical)}`);
  if (p.service) w.add(`service = ${w.bind(p.service)}`);
  if (p.city) w.add(`city = ${w.bind(p.city)}`);
  if (p.agent === "unassigned") w.add("assigned_to is null");
  else if (p.agent) w.add(`assigned_to = ${w.bind(p.agent)}::uuid`);
  if (p.from) w.add(`created_at >= ${w.bind(p.from)}::timestamptz`);
  if (p.to) w.add(`created_at < ${w.bind(p.to)}::timestamptz`);
}

function addTransientFilters(w: SqlWhere, p: LeadListParams): void {
  if (p.status) w.add(`status = ${w.bind(p.status)}`);
  if (p.q) {
    const pattern = w.bind(`%${escapeLike(p.q)}%`);
    w.add(`(name ilike ${pattern} or phone like ${pattern})`);
  }
}

// Explicit column list, not `select *` — the export modes carry every matching
// lead, so a column nobody reads is paid for thousands of times over. This is
// the UNION of what the two consumers need, and BOTH must be re-checked before
// narrowing it further:
//   app/dashboard/page.tsx          the lead table + detail modal
//   app/dashboard/reports/page.tsx  campaign attribution, which needs the
//                                   utm_* columns the lead table ignores
// Omitted as unused by both: utm_term, utm_content, referrer (the last being
// the widest column on the table, at up to 500 chars a row).
// NB: there is no `branch` or `department` column — `select *` just returned
// nothing for those, and the old search box searched a field that never existed.
const LEAD_COLUMNS = `id, created_at, city, name, phone, status,
       status_changed_by, status_changed_at, assigned_to, assigned_to_name,
       channel, note, created_by, vertical, service,
       utm_source, utm_medium, utm_campaign, utm_link_id`;

// Newest first, as the portal has always shown it. `id` breaks ties so a page
// boundary between two leads with the same timestamp never repeats or skips a
// row (Postgres serves this off the created_at index with an incremental sort).
const LEAD_ORDER = "order by created_at desc, id desc";

// Leads created since midnight in the clinic's own timezone, not the server's
// (UTC in the container) and not the viewer's browser.
const TODAY_RIYADH =
  "created_at >= (date_trunc('day', now() at time zone 'Asia/Riyadh') at time zone 'Asia/Riyadh')";

export type LeadStats = { total: number; today: number; pending: number; booked: number };

export type LeadListTable = {
  data: Record<string, unknown>[];
  page: number;
  size: number;
  /** Rows matching scope + every filter: the pager denominator. */
  total: number;
  /** Rows matching scope + structural filters only: the "of Y" denominator. */
  scoped: number;
  /** Counted over the same set as `scoped`. */
  stats: LeadStats;
};
export type LeadListBody = LeadListTable | { data: Record<string, unknown>[] } | { ids: string[] };

const EMPTY_STATS: LeadStats = { total: 0, today: 0, pending: 0, booked: 0 };

export async function runLeadList(user: CurrentUser, p: LeadListParams): Promise<LeadListBody> {
  const scope = leadScope(user);
  if (!scope) {
    if (p.mode === "ids") return { ids: [] };
    if (p.mode === "table") return { data: [], page: p.page, size: p.size, total: 0, scoped: 0, stats: EMPTY_STATS };
    return { data: [] };
  }

  const base = scope;
  addStructuralFilters(base, p);
  const full = base.clone();
  addTransientFilters(full, p);

  if (p.mode === "ids") {
    const rows = await query<{ id: string }>(
      `select id from appointments ${full.sql} ${LEAD_ORDER}`,
      full.params
    );
    return { ids: rows.map((r) => r.id) };
  }

  if (p.mode === "export" || p.mode === "report") {
    return { data: await query(`select ${LEAD_COLUMNS} from appointments ${full.sql} ${LEAD_ORDER}`, full.params) };
  }

  // Table: three independent queries in flight together (the pool holds 5).
  // When no transient filter is active, `total` is `scoped` by definition and
  // the extra count is skipped.
  const hasTransient = full.conds.length > base.conds.length;
  // Same WHERE as `full`, plus the two paging params only the row query takes.
  const paged = full.clone();
  const limit = paged.bind(p.size);
  const offset = paged.bind((p.page - 1) * p.size);
  const [stats, totalRow, data] = await Promise.all([
    query<LeadStats>(
      `select count(*)::int as total,
              count(*) filter (where ${TODAY_RIYADH})::int as today,
              count(*) filter (where status = 'pending')::int as pending,
              count(*) filter (where status in ('booked', 'confirmed'))::int as booked
         from appointments ${base.sql}`,
      base.params
    ).then((r) => r[0] ?? EMPTY_STATS),
    hasTransient
      ? query<{ total: number }>(
          `select count(*)::int as total from appointments ${full.sql}`,
          full.params
        ).then((r) => r[0]?.total ?? 0)
      : null,
    query(
      `select ${LEAD_COLUMNS} from appointments ${paged.sql} ${LEAD_ORDER} limit ${limit} offset ${offset}`,
      paged.params
    ),
  ]);

  return {
    data,
    page: p.page,
    size: p.size,
    total: totalRow ?? stats.total,
    scoped: stats.total,
    stats,
  };
}
