import bcrypt from "bcryptjs";
import { COOKIE_NAME, JWT_EXPIRY_SECONDS, HttpError, errorResponse, signToken } from "@/app/lib/auth";
import { queryOne } from "@/app/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TeamMemberRow = Parameters<typeof signToken>[0] & { password_hash: string };

/** Non-@myclinic.com.sa addresses that may still sign in (mirrors config.py). */
function emailExceptions(): Set<string> {
  return new Set(
    (process.env.LOGIN_EMAIL_EXCEPTIONS ?? "amr.ali@inception.sa")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) throw new HttpError(400, "Email and password are required");
    if (!email.endsWith("@myclinic.com.sa") && !emailExceptions().has(email)) {
      throw new HttpError(400, "Only @myclinic.com.sa emails are allowed");
    }

    const user = await queryOne<TeamMemberRow>("select * from team_members where email = $1", [email]);
    // Same message whether the account is missing or the password is wrong, so
    // the response can't be used to enumerate who has an account.
    if (!user) throw new HttpError(401, "Invalid credentials");
    if (!user.is_active) throw new HttpError(401, "Account is deactivated");
    if (!(await bcrypt.compare(password, user.password_hash))) {
      throw new HttpError(401, "Invalid credentials");
    }

    const token = await signToken(user);
    const response = Response.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    // Only mark the cookie Secure when the request actually arrived over HTTPS
    // (true on Vercel, false on plain-http local dev / the VM before its TLS
    // cutover) — a Secure cookie on an http origin is silently dropped.
    const isHttps = request.headers.get("x-forwarded-proto") === "https";
    response.headers.append(
      "Set-Cookie",
      [
        `${COOKIE_NAME}=${token}`,
        `Max-Age=${JWT_EXPIRY_SECONDS}`,
        "Path=/",
        "HttpOnly",
        "SameSite=Lax",
        ...(isHttps ? ["Secure"] : []),
      ].join("; ")
    );
    return response;
  } catch (err) {
    return errorResponse(err);
  }
}
