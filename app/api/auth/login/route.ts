import { NextResponse } from "next/server";
import { queryOne } from "@/app/lib/db";
import { comparePassword, signToken, sessionCookieHeader } from "@/app/lib/auth";

type TeamMember = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: "super_admin" | "admin" | "agent";
  allowed_cities: string[] | null;
  is_active: boolean | null;
  can_export: boolean | null;
};

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

    const user = await queryOne<TeamMember>(
      "select * from team_members where email = $1",
      [normalizedEmail]
    );

    if (!user) {
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
  } catch (err) {
    // A thrown error here is almost always a server-side misconfiguration
    // (missing DATABASE_URL or JWT_SECRET) rather than bad input — log it so it
    // surfaces in the platform's function logs, and return a 500.
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
