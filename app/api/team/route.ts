import {
  ADMIN_ROLES,
  HttpError,
  errorResponse,
  generatePassword,
  hasRole,
  hashPassword,
  isRole,
  normalizeRoles,
  parseRolesInput,
  primaryRole,
  requireRoles,
} from "@/app/lib/auth";
import { query, queryOne } from "@/app/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MEMBER_COLS = "id, email, name, role, roles, allowed_cities, is_active, can_export, created_at";

/**
 * List the team. A super_admin sees everyone; an admin is isolated to members
 * whose allowed_cities overlap their own (and an admin with no cities therefore
 * sees nobody, rather than everybody).
 */
export async function GET() {
  try {
    const user = await requireRoles(...ADMIN_ROLES);

    if (hasRole(user.roles, "super_admin")) {
      return Response.json({
        data: await query(`select ${MEMBER_COLS} from team_members order by created_at desc`),
      });
    }
    if (!user.allowed_cities.length) return Response.json({ data: [] });

    return Response.json({
      data: await query(
        `select ${MEMBER_COLS} from team_members
         where allowed_cities && $1::text[] order by created_at desc`,
        [user.allowed_cities]
      ),
    });
  } catch (err) {
    return errorResponse(err);
  }
}

/** Create a member and hand back the generated password once, to pass on. */
export async function POST(request: Request) {
  try {
    const user = await requireRoles(...ADMIN_ROLES);
    const body = await request.json().catch(() => ({}));

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const allowedCities: string[] = Array.isArray(body.allowed_cities) ? body.allowed_cities : [];
    const canExport = Boolean(body.can_export);
    const requested = parseRolesInput(body) ?? [];

    if (!email || !name) throw new HttpError(400, "Email and name are required");
    if (!email.endsWith("@myclinic.com.sa")) {
      throw new HttpError(400, "Only @myclinic.com.sa emails are allowed");
    }

    // Reject an unknown role rather than quietly downgrading the member to
    // `agent` — a typo in one checkbox used to cost them every other role.
    if (!requested.length) throw new HttpError(400, "Pick at least one role");
    if (!requested.every(isRole)) throw new HttpError(400, "Invalid role");
    const roles = normalizeRoles(requested);

    // An admin must not be able to mint a super_admin, nor grant themselves
    // reach into a city they don't already have. `.includes`, not `===`: the
    // request is a set now, and ["agent","super_admin"] equals neither.
    if (!hasRole(user.roles, "super_admin")) {
      if (roles.includes("super_admin")) throw new HttpError(403, "Forbidden");
      if (allowedCities.some((c) => !user.allowed_cities.includes(c))) {
        throw new HttpError(403, "Cannot assign cities outside your scope");
      }
    }

    if (await queryOne("select id from team_members where email = $1", [email])) {
      throw new HttpError(409, "Email already exists");
    }

    const password = generatePassword();

    const created = await queryOne(
      `insert into team_members (email, name, password_hash, role, roles, allowed_cities, can_export, is_active)
       values ($1, $2, $3, $4, $5::text[], $6::text[], $7, true)
       returning ${MEMBER_COLS}`,
      [email, name, await hashPassword(password), primaryRole(roles), roles, allowedCities, canExport]
    );

    return Response.json({ user: created, generated_password: password });
  } catch (err) {
    return errorResponse(err);
  }
}
