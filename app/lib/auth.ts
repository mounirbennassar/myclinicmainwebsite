import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { queryOne } from "./db";
import { type Role, ROLE_LABELS, ADMIN_ROLES, hasRole, normalizeRoles, primaryRole } from "./roles";

/**
 * Session auth for the Next-served API routes (app/api/auth, app/api/team,
 * app/api/appointments, app/api/doctors).
 *
 * The token format is deliberately identical to backend/app/security.py — jose
 * HS256, cookie "session", 7-day expiry, same claim set — so a session minted
 * here is accepted by FastAPI (and by proxy.ts) and vice versa. Change one side
 * and you must change the other.
 */

export const COOKIE_NAME = "session";
export const JWT_EXPIRY_SECONDS = 7 * 24 * 60 * 60;

// The role vocabulary lives in ./roles, which has no server-only imports so the
// client components can share it. Re-exported here so route handlers can keep
// pulling everything auth-shaped from one module.
export * from "./roles";

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  /**
   * Every role this member holds. There is deliberately no singular `role`
   * here: a member can be an agent AND a content_manager, and any code that
   * compares one scalar would silently deny one of the two.
   */
  roles: Role[];
  allowed_cities: string[];
  is_active: boolean;
  can_export: boolean;
};

type TeamMemberRow = {
  id: string;
  email: string;
  name: string;
  /** Derived primary role. Kept for the JWT fallback; never an access decision. */
  role: Role | null;
  roles: Role[] | null;
  allowed_cities: string[] | null;
  is_active: boolean;
  can_export: boolean | null;
};

function secret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(s);
}

/** `roles` is the source of truth; fall back to the legacy scalar for any row written before migration 005. */
function rolesOf(row: { role?: string | null; roles?: string[] | null }): Role[] {
  const roles = normalizeRoles(row.roles ?? []);
  return roles.length ? roles : normalizeRoles(row.role ? [row.role] : []);
}

/** Admins can always export, regardless of the per-user flag. Mirrors sign_token(). */
function canExport(roles: Role[], flag: unknown): boolean {
  return hasRole(roles, ...ADMIN_ROLES) || Boolean(flag);
}

export async function signToken(user: TeamMemberRow): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const roles = rolesOf(user);
  return new SignJWT({
    email: user.email,
    name: user.name,
    roles,
    // Still emitted so a session minted by the new code is readable by anything
    // that has not been redeployed yet (and by FastAPI's DB-outage fallback).
    role: primaryRole(roles),
    allowed_cities: user.allowed_cities ?? [],
    can_export: canExport(roles, user.can_export),
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
    "select id, email, name, role, roles, allowed_cities, is_active, can_export from team_members where id = $1::uuid",
    [sub]
  );
  // A deleted or deactivated account must not keep riding a still-valid token.
  if (!row || !row.is_active) return null;

  const roles = rolesOf(row);
  return {
    id: String(row.id),
    email: row.email,
    name: row.name,
    roles,
    allowed_cities: row.allowed_cities ?? [],
    is_active: true,
    can_export: canExport(roles, row.can_export),
  };
}

/** "Safwan Hassan (Admin)" — stamped onto leads on create / status change. One slot, so the highest-authority role speaks for them. */
export function actorLabel(user: CurrentUser): string {
  const role = primaryRole(user.roles);
  return `${user.name || "Unknown"} (${ROLE_LABELS[role] ?? role})`;
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

/** Resolve the caller and assert they hold at least one of `roles`, or throw 401/403. */
export async function requireRoles(...roles: Role[]): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) throw new HttpError(401, "Unauthorized");
  if (!hasRole(user.roles, ...roles)) throw new HttpError(403, "Forbidden");
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
