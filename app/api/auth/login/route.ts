import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase";
import { comparePassword, signToken, sessionCookieHeader } from "@/app/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const EMAIL_EXCEPTIONS = new Set<string>([
      "amr.ali@inception.sa",
    ]);

    if (!normalizedEmail.endsWith("@myclinic.com.sa") && !EMAIL_EXCEPTIONS.has(normalizedEmail)) {
      return NextResponse.json({ error: "Only @myclinic.com.sa emails are allowed" }, { status: 400 });
    }

    const admin = getServiceSupabase();
    const { data: user, error } = await admin
      .from("team_members")
      .select("*")
      .eq("email", normalizedEmail)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (!user.is_active) {
      return NextResponse.json({ error: "Account is deactivated" }, { status: 401 });
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      allowed_cities: user.allowed_cities || [],
      can_export: (user.role === "super_admin" || user.role === "admin") ? true : (user.can_export ?? false),
    });

    const res = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    res.headers.set("Set-Cookie", sessionCookieHeader(token));
    return res;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
