/**
 * The role vocabulary, and the membership tests built on it.
 *
 * A team member holds a SET of roles: "agent + content_manager" is a real
 * person who works the leads pipeline and writes the blog. So every permission
 * question is "do their roles intersect the roles this surface allows?" —
 * hasRole() — and never `user.role === "x"`, which is false for everyone
 * holding more than one role.
 *
 * Deliberately dependency-free. app/dashboard/layout.tsx is a client component
 * and cannot import app/lib/auth.ts (that pulls `pg` into the browser bundle),
 * which is why the role list used to be copy-pasted into three files. This
 * module is safe to import from anywhere. Mirrored in backend/app/security.py.
 */

export type Role =
  | "super_admin"
  | "admin"
  | "agent"
  | "marketing"
  | "content_manager"
  | "doctors_manager";

/**
 * Every valid role, highest authority first.
 *
 * The order is load-bearing: primaryRole() reads it as a precedence list, and
 * normalizeRoles() sorts by it, so a member's roles are stored, sent and
 * rendered in one stable order rather than in whatever order the checkboxes
 * were ticked.
 */
export const ROLES: Role[] = [
  "super_admin",
  "admin",
  "marketing",
  "agent",
  "content_manager",
  "doctors_manager",
];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  agent: "Agent",
  marketing: "Marketing",
  content_manager: "Content Manager",
  doctors_manager: "Doctors Manager",
};

/** What ticking each box actually grants. Shown beside it in the team form. */
export const ROLE_HINTS: Record<Role, string> = {
  super_admin: "Everything, including deleting leads and team members.",
  admin: "Leads, reports, UTM, team and content — but not the doctors directory.",
  agent: "Only the leads assigned to them, in their allowed cities.",
  marketing: "Leads, reports and UTM links.",
  content_manager: "Blog, news and site pages.",
  doctors_manager: "The doctors directory.",
};

// ── Role groups ─────────────────────────────────────────────────────────────
// Allowlists, never "everyone except X": a denylist silently hands each new
// role the lead pipeline. Mirrors the groups in backend/app/security.py.

/** May administer the team and WhatsApp. */
export const ADMIN_ROLES: Role[] = ["super_admin", "admin"];

/** May open the lead pipeline. Excludes content_manager and doctors_manager — they have no business reading patient enquiries. */
export const LEAD_VIEW_ROLES: Role[] = ["super_admin", "admin", "marketing", "agent"];

/**
 * Of the lead-facing roles, the ones that see EVERY lead in their cities.
 *
 * An `agent` sees only the leads assigned to them. That restriction is part of
 * what `agent` grants, not a ceiling on the member — roles add up, they never
 * subtract — so someone who is agent AND admin sees the whole city pipeline.
 * Same value as MARKETING_ROLES today, but a different idea: if marketing ever
 * loses lead access, only one of these two lists changes.
 */
export const LEAD_ALL_ROLES: Role[] = ["super_admin", "admin", "marketing"];

/** May see reports and UTM links. */
export const MARKETING_ROLES: Role[] = ["super_admin", "admin", "marketing"];

/** May manage site content (pages / blog / news). */
export const CONTENT_ROLES: Role[] = ["super_admin", "admin", "content_manager"];

/** May maintain the doctors directory. Excludes `admin` on purpose: the directory belongs to the super admins and to whoever holds the dedicated role. */
export const DOCTOR_ROLES: Role[] = ["super_admin", "doctors_manager"];

/**
 * Roles whose lead visibility is scoped by allowed_cities. A member gets the
 * city picker if ANY of their roles is city-scoped.
 */
export const CITY_SCOPED_ROLES: Role[] = ["admin", "marketing", "agent"];

// ── Tests ───────────────────────────────────────────────────────────────────

/** Does this member hold at least one of `want`? The multi-role replacement for `user.role === "x"`. */
export function hasRole(roles: readonly string[] | null | undefined, ...want: Role[]): boolean {
  return !!roles && roles.some((r) => (want as readonly string[]).includes(r));
}

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/**
 * Known roles only, deduped, in ROLES order. Filtering ROLES by the requested
 * set — rather than the other way round — gets all three properties at once.
 *
 * Unknown values are dropped silently, so callers that accept user input must
 * reject them first with isRole(); see app/api/team/route.ts.
 */
export function normalizeRoles(input: readonly string[]): Role[] {
  const wanted = new Set(input);
  return ROLES.filter((r) => wanted.has(r));
}

/**
 * The single role that stands in for the member wherever only one fits: the
 * actor stamped on a lead, the caption under their name. Highest authority
 * wins, per ROLES order.
 */
export function primaryRole(roles: readonly string[]): Role {
  return ROLES.find((r) => roles.includes(r)) ?? "agent";
}

/**
 * Pull the requested roles off a team create/update body, as raw strings — the
 * caller still has to validate them with isRole().
 *
 * `null` means "the body didn't mention roles at all", which a PATCH must treat
 * as "leave them alone" rather than as "clear them". The legacy singular
 * `memberRole` is still accepted so an older client (or a hand-rolled curl)
 * doesn't start failing.
 */
export function parseRolesInput(body: Record<string, unknown>): string[] | null {
  if (Array.isArray(body.memberRoles)) return body.memberRoles.map(String);
  if (typeof body.memberRole === "string") return [body.memberRole];
  return null;
}

/**
 * Where a member lands after signing in: the first surface their roles can
 * actually open, so a content_manager isn't dropped on an empty leads pipeline.
 * Ordered by what people spend their day in, not by authority.
 */
export function homeRoute(roles: readonly string[]): string {
  if (hasRole(roles, ...LEAD_VIEW_ROLES)) return "/dashboard";
  if (hasRole(roles, ...DOCTOR_ROLES)) return "/dashboard/doctors";
  if (hasRole(roles, ...CONTENT_ROLES)) return "/dashboard/content";
  return "/dashboard";
}
