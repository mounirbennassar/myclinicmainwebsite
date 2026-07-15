import {
  ADMIN_ROLES,
  HttpError,
  LEAD_ALL_ROLES,
  LEAD_VIEW_ROLES,
  actorLabel,
  errorResponse,
  getCurrentUser,
  hasRole,
  requireRoles,
} from "@/app/lib/auth";
import { query, queryOne } from "@/app/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_VERTICALS = new Set(["medical", "dental", "pediatric"]);
const ALLOWED_DENTAL_SERVICES = new Set([
  "general", "implants", "orthodontics", "veneers", "oral-surgery",
  "pediatric", "root-canal", "whitening", "crowns-bridges", "gums",
  "emergency", "laser", "special-needs", "seniors", "holistic", "gbt-cleaning",
]);

const clip = (v: unknown, n: number): string | null =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, n) : null;

/**
 * Book an appointment. PUBLIC — this is what every booking form on the site
 * posts to (home, contact, dental, pediatric, women's care). It must never
 * require auth, and it must never 404: a failure here is a lost patient.
 *
 * `manual: true` is the dashboard adding a lead by hand, and that DOES require a
 * session.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { city, name, phone } = body;
    if (!city || !name || !phone) throw new HttpError(400, "All fields are required");

    const data: Record<string, unknown> = { city, name, phone };

    const vertical = ALLOWED_VERTICALS.has(body.vertical) ? body.vertical : "medical";
    data.vertical = vertical;
    if (vertical === "dental" && ALLOWED_DENTAL_SERVICES.has(body.service)) {
      data.service = body.service;
    }

    if (body.manual) {
      const user = await getCurrentUser();
      if (!user) throw new HttpError(401, "Unauthorized");
      if (body.channel) data.channel = body.channel;
      if (body.note) data.note = body.note;
      data.created_by = actorLabel(user);
    } else {
      data.channel = "Website";
      const note = clip(body.note, 2000);
      if (note) data.note = note;

      const utm = body.utm;
      if (utm && typeof utm === "object") {
        for (const key of ["source", "medium", "campaign", "term", "content"] as const) {
          const v = clip(utm[key], 100);
          if (v) data[`utm_${key}`] = v;
        }

        // Attribute the lead back to the UTM link it came from.
        const ref = clip(utm.ref, 40);
        if (ref) {
          const link = await queryOne<{ id: string }>("select id from utm_links where slug = $1", [ref]);
          if (link) data.utm_link_id = link.id;
        }
        // Fall back to the source+medium+campaign tuple so raw ?utm_… URLs
        // (which bypass /go/<slug>) still attribute to the originating link.
        if (!data.utm_link_id && utm.source && utm.medium && utm.campaign) {
          const conds = ["source = $1", "medium = $2", "campaign = $3"];
          const vals: unknown[] = [
            clip(utm.source, 100),
            clip(utm.medium, 100),
            clip(utm.campaign, 100),
          ];
          if (utm.term) {
            vals.push(clip(utm.term, 100));
            conds.push(`term = $${vals.length}`);
          }
          if (utm.content) {
            vals.push(clip(utm.content, 100));
            conds.push(`content = $${vals.length}`);
          }
          const match = await queryOne<{ id: string }>(
            `select id from utm_links where ${conds.join(" and ")} order by created_at desc limit 1`,
            vals
          );
          if (match) data.utm_link_id = match.id;
        }
      }

      const referrer = clip(body.referrer, 500);
      if (referrer) data.referrer = referrer;
    }

    const cols = Object.keys(data);
    const row = await queryOne(
      `insert into appointments (${cols.join(", ")})
       values (${cols.map((_, i) => `$${i + 1}`).join(", ")}) returning *`,
      cols.map((c) => data[c])
    );
    return Response.json({ success: true, data: row });
  } catch (err) {
    return errorResponse(err);
  }
}

/** The lead pipeline. Agents see only their own; non-super-admins only their cities. */
export async function GET() {
  try {
    const user = await requireRoles(...LEAD_VIEW_ROLES);
    const isSuperAdmin = hasRole(user.roles, "super_admin");
    if (!isSuperAdmin && !user.allowed_cities.length) {
      return Response.json({ data: [] });
    }

    const conds: string[] = [];
    const params: unknown[] = [];
    if (!isSuperAdmin) {
      params.push(user.allowed_cities);
      conds.push(`city = ANY($${params.length}::text[])`);
    }
    // Own-leads-only is what `agent` means, and it survives being paired with a
    // non-lead role like content_manager. Pairing it with admin lifts it —
    // that's the whole point of granting both.
    if (hasRole(user.roles, "agent") && !hasRole(user.roles, ...LEAD_ALL_ROLES)) {
      params.push(user.id);
      conds.push(`assigned_to = $${params.length}::uuid`);
    }

    const where = conds.length ? `where ${conds.join(" and ")}` : "";
    return Response.json({
      data: await query(`select * from appointments ${where} order by created_at desc`, params),
    });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireRoles(...LEAD_VIEW_ROLES);
    const body = await request.json().catch(() => ({}));
    if (!body.id) throw new HttpError(400, "Missing id");

    // An agent may only touch their own leads, and nobody but a super_admin may
    // touch a lead outside their cities.
    if (!hasRole(user.roles, "super_admin")) {
      const lead = await queryOne<{ assigned_to: string | null; city: string | null }>(
        "select assigned_to, city from appointments where id = $1::uuid",
        [body.id]
      );
      if (!lead) throw new HttpError(403, "Forbidden");
      if (
        hasRole(user.roles, "agent") &&
        !hasRole(user.roles, ...LEAD_ALL_ROLES) &&
        lead.assigned_to !== user.id
      ) {
        throw new HttpError(403, "Forbidden");
      }
      if (!lead.city || !user.allowed_cities.includes(lead.city)) throw new HttpError(403, "Forbidden");
    }

    const sets: string[] = [];
    const values: unknown[] = [];
    const set = (col: string, value: unknown, cast = "") => {
      values.push(value);
      sets.push(`${col} = $${values.length}${cast}`);
    };

    const changedStatus = Boolean(body.status);
    if (changedStatus) {
      set("status", body.status);
      set("status_changed_by", actorLabel(user));
      sets.push("status_changed_at = now()");
    }
    // Only admins reassign a lead to another agent.
    const reassigned = "assigned_to" in body && hasRole(user.roles, ...ADMIN_ROLES);
    if (reassigned) {
      set("assigned_to", body.assigned_to || null, "::uuid");
      set("assigned_to_name", body.assigned_to_name || null);
    }

    if (!sets.length) throw new HttpError(400, "Nothing to update");

    values.push(body.id);
    const row = await queryOne<Record<string, unknown>>(
      `update appointments set ${sets.join(", ")} where id = $${values.length}::uuid
       returning status_changed_by, status_changed_at, assigned_to, assigned_to_name`,
      values
    );

    const out: Record<string, unknown> = { success: true };
    if (row && changedStatus) {
      out.status_changed_by = row.status_changed_by;
      out.status_changed_at = row.status_changed_at;
    }
    if (row && reassigned) {
      out.assigned_to = row.assigned_to;
      out.assigned_to_name = row.assigned_to_name;
    }
    return Response.json(out);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireRoles("super_admin");
    const body = await request.json().catch(() => ({}));
    const ids: unknown = body.ids;

    if (Array.isArray(ids) && ids.length) {
      await query("delete from appointments where id = ANY($1::uuid[])", [ids]);
    } else if (body.id) {
      await query("delete from appointments where id = $1::uuid", [body.id]);
    } else {
      throw new HttpError(400, "Missing id or ids");
    }
    return Response.json({ success: true });
  } catch (err) {
    return errorResponse(err);
  }
}
