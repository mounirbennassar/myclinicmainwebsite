import {
  ADMIN_ROLES,
  HttpError,
  ROLES,
  type Role,
  errorResponse,
  generatePassword,
  hashPassword,
  requireRoles,
} from "@/app/lib/auth";
import { query, queryOne } from "@/app/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MEMBER_COLS = "id, email, name, role, allowed_cities, is_active, can_export, created_at";

/**
 * List the team. A super_admin sees everyone; an admin is isolated to members
 * whose allowed_cities overlap their own (and an admin with no cities therefore
 * sees nobody, rather than everybody).
 */
export async function GET() {
  try {
    const user = await requireRoles(...ADMIN_ROLES);

    if (user.role === "super_admin") {
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
    const requested = String(body.memberRole ?? "agent");

    if (!email || !name) throw new HttpError(400, "Email and name are required");
    if (!email.endsWith("@myclinic.com.sa")) {
      throw new HttpError(400, "Only @myclinic.com.sa emails are allowed");
    }

    // An admin must not be able to mint a super_admin, nor grant themselves
    // reach into a city they don't already have.
    if (user.role !== "super_admin") {
      if (requested === "super_admin") throw new HttpError(403, "Forbidden");
      if (allowedCities.some((c) => !user.allowed_cities.includes(c))) {
        throw new HttpError(403, "Cannot assign cities outside your scope");
      }
    }

    if (await queryOne("select id from team_members where email = $1", [email])) {
      throw new HttpError(409, "Email already exists");
    }

    const password = generatePassword();
    const role: Role = (ROLES as string[]).includes(requested) ? (requested as Role) : "agent";

    const created = await queryOne(
      `insert into team_members (email, name, password_hash, role, allowed_cities, can_export, is_active)
       values ($1, $2, $3, $4, $5::text[], $6, true)
       returning ${MEMBER_COLS}`,
      [email, name, await hashPassword(password), role, allowedCities, canExport]
    );

    return Response.json({ user: created, generated_password: password });
  } catch (err) {
    return errorResponse(err);
  }
}
