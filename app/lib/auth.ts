import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { queryOne } from "./db";

/**
 * Session auth for the Next-served API routes (app/api/auth, app/api/doctors).
 *
 * The token format is deliberately identical to backend/app/security.py — jose
 * HS256, cookie "session", 7-day expiry, same claim set — so a session minted
 * here is accepted by FastAPI (and by proxy.ts) and vice versa. Change one side
 * and you must change the other.
 */

export const COOKIE_NAME = "session";
export const JWT_EXPIRY_SECONDS = 7 * 24 * 60 * 60;

export type Role =
  | "super_admin"
  | "admin"
  | "agent"
  | "marketing"
  | "content_manager"
  | "doctors_manager";

/** Roles allowed to administer team / WhatsApp. Mirrors security.py ADMIN_ROLES. */
export const ADMIN_ROLES: Role[] = ["super_admin", "admin"];

/**
 * Roles allowed to maintain the doctors directory. Mirrors security.py
 * DOCTOR_ROLES.
 *
 * Deliberately excludes `admin` — the directory belongs to the super admins and
 * to whoever holds the dedicated doctors_manager role. A doctors_manager gets
 * the CMS and nothing else (no leads, no team, no reports).
 */
export const DOCTOR_ROLES: Role[] = ["super_admin", "doctors_manager"];

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  allowed_cities: string[];
  is_active: boolean;
  can_export: boolean;
};

type TeamMemberRow = {
  id: string;
  email: string;
  name: string;
  role: Role;
  allowed_cities: string[] | null;
  is_active: boolean;
  can_export: boolean | null;
};

function secret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(s);
}

/** Admins can always export, regardless of the per-user flag. Mirrors sign_token(). */
function canExport(role: string, flag: unknown): boolean {
  return role === "super_admin" || role === "admin" ? true : Boolean(flag);
}

export async function signToken(user: TeamMemberRow): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
    allowed_cities: user.allowed_cities ?? [],
    can_export: canExport(user.role, user.can_export),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt(now)
    .setExpirationTime(now + JWT_EXPIRY_SECONDS)
    .sign(secret());
}

/**
 * Resolve the caller from the session cookie, re-reading team_members so that
 * role changes and deactivations take effect without a re-login (same contract
 * as security.py get_current_user). Returns null when unauthenticated.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  let sub: string;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    sub = String(payload.sub);
  } catch {
    return null;
  }

  const row = await queryOne<TeamMemberRow>(
    "select id, email, name, role, allowed_cities, is_active, can_export from team_members where id = $1::uuid",
    [sub]
  );
  // A deleted or deactivated account must not keep riding a still-valid token.
  if (!row || !row.is_active) return null;

  return {
    id: String(row.id),
    email: row.email,
    name: row.name,
    role: row.role,
    allowed_cities: row.allowed_cities ?? [],
    is_active: true,
    can_export: canExport(row.role, row.can_export),
  };
}

/** Every role the DB's team_members_role_check will accept. Mirrors security.py ROLES. */
export const ROLES: Role[] = [
  "super_admin",
  "admin",
  "agent",
  "marketing",
  "content_manager",
  "doctors_manager",
];

// Mirrors security.py ROLE_LABELS. Duplicated in app/dashboard/layout.tsx, which
// is a client component and cannot import this module (it pulls in pg).
export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  agent: "Agent",
  marketing: "Marketing",
  content_manager: "Content Manager",
  doctors_manager: "Doctors Manager",
};

/** Roles allowed to see the lead pipeline. Mirrors security.py LEAD_VIEW_ROLES. */
export const LEAD_VIEW_ROLES: Role[] = ["super_admin", "admin", "marketing", "agent"];

/** "Safwan Hassan (Admin)" — stamped onto leads on create / status change. */
export function actorLabel(user: CurrentUser): string {
  return `${user.name || "Unknown"} (${ROLE_LABELS[user.role] ?? user.role})`;
}

// No look-alike characters (0/O, 1/l/I) — these get read aloud and retyped.
const PASSWORD_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

/** A random initial password for a new team member. Mirrors security.py generate_password. */
export function generatePassword(length = 12): string {
  return Array.from(randomBytes(length))
    .map((b) => PASSWORD_ALPHABET[b % PASSWORD_ALPHABET.length])
    .join("");
}

/** bcrypt(10) — the same cost FastAPI uses, so hashes are interchangeable. */
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/** Thrown by requireRoles; route handlers turn it into a JSON error response. */
export class HttpError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

/** Resolve the caller and assert their role, or throw 401/403. */
export async function requireRoles(...roles: Role[]): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) throw new HttpError(401, "Unauthorized");
  if (!roles.includes(user.role)) throw new HttpError(403, "Forbidden");
  return user;
}

/**
 * Shape errors like FastAPI's global handler does ({"error": "..."}), because
 * the dashboard reads `data.error` off every failed response.
 */
export function errorResponse(err: unknown): Response {
  const status = err instanceof HttpError ? err.status : 500;
  const message =
    err instanceof HttpError ? err.message : "Something went wrong. Please try again.";
  if (status === 500) console.error(err);
  return Response.json({ error: message }, { status });
}
