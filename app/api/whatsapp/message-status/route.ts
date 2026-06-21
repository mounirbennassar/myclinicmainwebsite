import { NextResponse } from "next/server";
import { anantya } from "@/app/lib/anantya";
import { requireAdmin } from "../_guard";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const url = new URL(request.url);
  const msgId = Number(url.searchParams.get("msgId") || 0);
  if (!msgId) {
    return NextResponse.json({ error: "msgId is required" }, { status: 400 });
  }

  const result = await anantya.getMessageStatus(msgId);
  if (!result.ok) {
    return NextResponse.json(
      { error: "Anantya request failed", status: result.status, raw: result.raw },
      { status: 502 },
    );
  }
  return NextResponse.json(result.data);
}
