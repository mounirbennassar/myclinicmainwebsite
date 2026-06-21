import { NextResponse } from "next/server";
import { anantya } from "@/app/lib/anantya";
import { requireAdmin } from "../_guard";

export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const contactNo: string | undefined = body?.contactNo?.trim();
  const msgText: string | undefined = body?.msgText;
  if (!contactNo || !msgText) {
    return NextResponse.json({ error: "contactNo and msgText are required" }, { status: 400 });
  }

  const result = await anantya.sendText(contactNo, msgText);
  return NextResponse.json(
    { ok: result.ok, status: result.status, data: result.data, raw: result.raw },
    { status: result.ok ? 200 : 502 },
  );
}
