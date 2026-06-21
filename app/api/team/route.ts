import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase";
import { hashPassword, generatePassword } from "@/app/lib/auth";

export async function GET(request: Request) {
  const role = request.headers.get("x-user-role");
  if (role !== "super_admin" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = getServiceSupabase();
  let query = admin
    .from("team_members")
    .select("id, email, name, role, allowed_cities, is_active, can_export, created_at")
    .order("created_at", { ascending: false });

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
    query = query.overlaps("allowed_cities", allowedCities);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
  }

  return NextResponse.json({ data });
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

    const password = generatePassword();
    const password_hash = await hashPassword(password);

    const admin = getServiceSupabase();

    // Check if email already exists
    const { data: existing } = await admin
      .from("team_members")
      .select("id")
      .eq("email", normalizedEmail)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const { data: user, error } = await admin
      .from("team_members")
      .insert([{
        email: normalizedEmail,
        name,
        password_hash,
        role: ["super_admin", "admin", "agent"].includes(memberRole) ? memberRole : "agent",
        allowed_cities,
        can_export,
        is_active: true,
      }])
      .select("id, email, name, role, allowed_cities, is_active, can_export, created_at")
      .single();

    if (error) {
      console.error("Team create error:", error);
      return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
    }

    return NextResponse.json({ user, generated_password: password });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
