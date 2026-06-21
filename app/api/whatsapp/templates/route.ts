import { NextResponse } from "next/server";
import { anantya } from "@/app/lib/anantya";
import { requireAdmin } from "../_guard";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const result = await anantya.getTemplates();
  if (!result.ok) {
    return NextResponse.json(
      { error: "Anantya request failed", status: result.status, raw: result.raw },
      { status: 502 },
    );
  }
  return NextResponse.json(result.data);
}
