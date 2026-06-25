import { NextResponse } from "next/server";
import { query, queryOne } from "@/app/lib/db";
import { hashPassword, generatePassword } from "@/app/lib/auth";

export async function GET(request: Request) {
  const role = request.headers.get("x-user-role");
  if (role !== "super_admin" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    let sqlText =
      "select id, email, name, role, allowed_cities, is_active, can_export, created_at from team_members";
    const params: unknown[] = [];

    // City isolation: non-super_admin admins only see team members whose
    // allowed_cities overlap with their own scope. super_admin sees everyone.
    if (role !== "super_admin") {
      let allowedCities: string[] = [];
      try {
        allowedCities = JSON.parse(request.headers.get("x-user-cities") || "[]");
      } catch {
        allowedCities = [];
      }
      if (!allowedCities.length) {
        return NextResponse.json({ data: [] });
      }
      params.push(allowedCities);
      sqlText += ` where allowed_cities && $${params.length}::text[]`;
    }

    sqlText += " order by created_at desc";
    const data = await query(sqlText, params);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const role = request.headers.get("x-user-role");
  if (role !== "super_admin" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { email, name, allowed_cities = [], memberRole = "agent", can_export = false } = body;

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 });
    }

    // City isolation: non-super_admin admins cannot create super_admins or
    // grant cities outside their own scope.
    if (role !== "super_admin") {
      let scope: string[] = [];
      try {
        scope = JSON.parse(request.headers.get("x-user-cities") || "[]");
      } catch {
        scope = [];
      }
      if (memberRole === "super_admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (Array.isArray(allowed_cities) && allowed_cities.some((c: string) => !scope.includes(c))) {
        return NextResponse.json({ error: "Cannot assign cities outside your scope" }, { status: 403 });
      }
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.endsWith("@myclinic.com.sa")) {
      return NextResponse.json({ error: "Only @myclinic.com.sa emails are allowed" }, { status: 400 });
    }

    // Check if email already exists
    const existing = await queryOne("select id from team_members where email = $1", [normalizedEmail]);
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const password = generatePassword();
    const password_hash = await hashPassword(password);
    const finalRole = ["super_admin", "admin", "agent"].includes(memberRole) ? memberRole : "agent";

    const user = await queryOne(
      `insert into team_members (email, name, password_hash, role, allowed_cities, can_export, is_active)
       values ($1, $2, $3, $4, $5::text[], $6, $7)
       returning id, email, name, role, allowed_cities, is_active, can_export, created_at`,
      [normalizedEmail, name, password_hash, finalRole, allowed_cities, can_export, true]
    );

    return NextResponse.json({ user, generated_password: password });
  } catch (err) {
    console.error("Team create error:", err);
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}
