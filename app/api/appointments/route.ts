import { NextResponse } from "next/server";
import { query, queryOne } from "@/app/lib/db";

// Whitelist what callers can write to `vertical` / `service` so a typo or
// abusive POST can't pollute the dashboard's filter pivots.
const ALLOWED_VERTICALS = new Set(["medical", "dental", "pediatric"]);
const ALLOWED_DENTAL_SERVICES = new Set([
  "general", "implants", "orthodontics", "veneers", "oral-surgery",
  "pediatric", "root-canal", "whitening", "crowns-bridges", "gums",
  "emergency", "laser", "special-needs", "seniors", "holistic", "gbt-cleaning",
]);

// POST — public (landing page) or authenticated (manual entry)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { city, name, phone, channel, note, manual, utm, referrer, vertical, service } = body;

    if (!city || !name || !phone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const insertData: Record<string, unknown> = { city, name, phone };

    // Vertical defaults to 'medical'. Dental LPs send vertical='dental' and a service slug.
    const v = typeof vertical === "string" && ALLOWED_VERTICALS.has(vertical) ? vertical : "medical";
    insertData.vertical = v;
    if (v === "dental" && typeof service === "string" && ALLOWED_DENTAL_SERVICES.has(service)) {
      insertData.service = service;
    }

    // Manual entry from authenticated user
    if (manual) {
      const userName = request.headers.get("x-user-name");
      const userRole = request.headers.get("x-user-role");
      if (!userRole) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (channel) insertData.channel = channel;
      if (note) insertData.note = note;
      const roleLabel = userRole === "super_admin" ? "Super Admin" : userRole === "admin" ? "Admin" : "Agent";
      insertData.created_by = `${userName || "Unknown"} (${roleLabel})`;
    } else {
      insertData.channel = "Website";

      // Public contact-form inquiries fold their subject/email/message into
      // `note` so the call centre sees the full message alongside the lead.
      if (typeof note === "string" && note.trim()) {
        insertData.note = note.slice(0, 2000);
      }

      if (utm && typeof utm === "object") {
        if (utm.source) insertData.utm_source = String(utm.source).slice(0, 100);
        if (utm.medium) insertData.utm_medium = String(utm.medium).slice(0, 100);
        if (utm.campaign) insertData.utm_campaign = String(utm.campaign).slice(0, 100);
        if (utm.term) insertData.utm_term = String(utm.term).slice(0, 100);
        if (utm.content) insertData.utm_content = String(utm.content).slice(0, 100);

        const refSlug = utm.ref ? String(utm.ref).slice(0, 40) : null;
        if (refSlug) {
          const link = await queryOne<{ id: string }>("select id from utm_links where slug = $1", [refSlug]);
          if (link?.id) insertData.utm_link_id = link.id;
        }
        // Fall back to source+medium+campaign tuple when no ref slug — this is
        // how raw `?utm_source=...` URLs (that bypass /go/<slug>) still attribute
        // their leads to the originating UTM link in the dashboard.
        if (!insertData.utm_link_id && utm.source && utm.medium && utm.campaign) {
          const conds = ["source = $1", "medium = $2", "campaign = $3"];
          const vals: unknown[] = [
            String(utm.source).slice(0, 100),
            String(utm.medium).slice(0, 100),
            String(utm.campaign).slice(0, 100),
          ];
          if (utm.term) { vals.push(String(utm.term).slice(0, 100)); conds.push(`term = $${vals.length}`); }
          if (utm.content) { vals.push(String(utm.content).slice(0, 100)); conds.push(`content = $${vals.length}`); }
          const match = await queryOne<{ id: string }>(
            `select id from utm_links where ${conds.join(" and ")} order by created_at desc limit 1`,
            vals
          );
          if (match?.id) insertData.utm_link_id = match.id;
        }
      }
      if (referrer) insertData.referrer = String(referrer).slice(0, 500);
    }

    const cols = Object.keys(insertData);
    const placeholders = cols.map((_, i) => `$${i + 1}`);
    const values = cols.map((c) => insertData[c]);
    const data = await queryOne(
      `insert into appointments (${cols.join(", ")}) values (${placeholders.join(", ")}) returning *`,
      values
    );

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Appointment insert error:", err);
    return NextResponse.json({ error: "Failed to submit appointment" }, { status: 500 });
  }
}

// GET is protected by middleware — user info is in headers
export async function GET(request: Request) {
  const role = request.headers.get("x-user-role");
  const citiesHeader = request.headers.get("x-user-cities");

  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let allowedCities: string[] = [];
  try {
    allowedCities = citiesHeader ? JSON.parse(citiesHeader) : [];
  } catch {
    allowedCities = [];
  }

  const agentUserId = role === "agent" ? request.headers.get("x-user-id") : null;
  if (role === "agent" && !agentUserId) {
    return NextResponse.json({ data: [] });
  }
  if (role !== "super_admin" && !allowedCities.length) {
    return NextResponse.json({ data: [] });
  }

  try {
    const conds: string[] = [];
    const params: unknown[] = [];
    if (role !== "super_admin") {
      params.push(allowedCities);
      conds.push(`city = ANY($${params.length}::text[])`);
    }
    if (agentUserId) {
      params.push(agentUserId);
      conds.push(`assigned_to = $${params.length}`);
    }
    const whereClause = conds.length ? `where ${conds.join(" and ")}` : "";
    const data = await query(
      `select * from appointments ${whereClause} order by created_at desc`,
      params
    );
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// PATCH is protected by middleware
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, assigned_to, assigned_to_name } = body;
    const role = request.headers.get("x-user-role");
    const userId = request.headers.get("x-user-id");

    if (!role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    let allowedCities: string[] = [];
    try {
      allowedCities = JSON.parse(request.headers.get("x-user-cities") || "[]");
    } catch {
      allowedCities = [];
    }

    // Fetch the appointment to enforce city + agent scoping
    if (role !== "super_admin") {
      const appt = await queryOne<{ assigned_to: string | null; city: string }>(
        "select assigned_to, city from appointments where id = $1",
        [id]
      );
      if (!appt) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      // Agents can only update appointments assigned to them
      if (role === "agent" && appt.assigned_to !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      // Admin/agent must be scoped to their allowed cities
      if (!allowedCities.includes(appt.city)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const updates: Record<string, unknown> = {};

    // Handle status change
    if (status) {
      const userName = request.headers.get("x-user-name") || "Unknown";
      const userRole = request.headers.get("x-user-role") || "agent";
      const changedBy = `${userName} (${userRole === "super_admin" ? "Super Admin" : userRole === "admin" ? "Admin" : "Agent"})`;
      updates.status = status;
      updates.status_changed_by = changedBy;
      updates.status_changed_at = new Date().toISOString();
    }

    // Handle assignment (admin/super_admin only)
    if (assigned_to !== undefined && (role === "super_admin" || role === "admin")) {
      updates.assigned_to = assigned_to || null;
      updates.assigned_to_name = assigned_to_name || null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const cols = Object.keys(updates);
    const setParts = cols.map((c, i) => `${c} = $${i + 1}`);
    const values = cols.map((c) => updates[c]);
    values.push(id);
    await query(`update appointments set ${setParts.join(", ")} where id = $${values.length}`, values);

    return NextResponse.json({
      success: true,
      ...(updates.status_changed_by ? { status_changed_by: updates.status_changed_by, status_changed_at: updates.status_changed_at } : {}),
      ...(updates.assigned_to !== undefined ? { assigned_to: updates.assigned_to, assigned_to_name: updates.assigned_to_name } : {}),
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// DELETE — super_admin only
export async function DELETE(request: Request) {
  try {
    const role = request.headers.get("x-user-role");

    if (role !== "super_admin") {
      return NextResponse.json({ error: "Only super admins can delete leads" }, { status: 403 });
    }

    const body = await request.json();
    const { id, ids } = body;

    if (!id && (!ids || !Array.isArray(ids) || ids.length === 0)) {
      return NextResponse.json({ error: "Missing id or ids" }, { status: 400 });
    }

    if (ids) {
      await query("delete from appointments where id = ANY($1::uuid[])", [ids]);
    } else {
      await query("delete from appointments where id = $1", [id]);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
