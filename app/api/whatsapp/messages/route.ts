import { NextResponse } from "next/server";
import { anantya } from "@/app/lib/anantya";
import { requireAdmin } from "../_guard";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const url = new URL(request.url);
  const contactNo = url.searchParams.get("contactNo")?.trim();
  const channelName = url.searchParams.get("channelName") || "";
  const id = Number(url.searchParams.get("id") || 0);
  if (!contactNo) {
    return NextResponse.json({ error: "contactNo is required" }, { status: 400 });
  }

  const result = await anantya.getMessages(contactNo, channelName, id);
  if (!result.ok) {
    return NextResponse.json(
      { error: "Anantya request failed", status: result.status, raw: result.raw },
      { status: 502 },
    );
  }
  return NextResponse.json(result.data);
}
