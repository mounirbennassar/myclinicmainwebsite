import { NextResponse } from "next/server";
import { clearSessionCookieHeader } from "@/app/lib/auth";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.headers.set("Set-Cookie", clearSessionCookieHeader());
  return res;
}
