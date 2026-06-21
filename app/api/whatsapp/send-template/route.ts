import { NextResponse } from "next/server";
import { anantya } from "@/app/lib/anantya";
import { requireAdmin } from "../_guard";

// Sends a single approved WhatsApp template to one recipient.
// Accepts JSON: { templateId, contactNo, contactName, attribute1..attribute13 }
// Anantya's endpoint takes multipart/form-data with templateId in the query string.
export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const templateId = Number(body?.templateId);
  const contactNo: string | undefined = body?.contactNo?.trim();
  const contactName: string = (body?.contactName || "").trim();
  if (!templateId || !contactNo) {
    return NextResponse.json({ error: "templateId and contactNo are required" }, { status: 400 });
  }

  const form = new FormData();
  form.append("ContactNo", contactNo);
  if (contactName) form.append("ContactName", contactName);
  if (body?.extraParams) form.append("ExtraParams", String(body.extraParams));
  for (let i = 1; i <= 13; i++) {
    const key = `attribute${i}`;
    const value = body?.[key];
    if (value !== undefined && value !== null && value !== "") {
      form.append(`Attribute${i}`, String(value));
    }
  }

  const result = await anantya.sendSingleTemplate(templateId, form);
  return NextResponse.json(
    { ok: result.ok, status: result.status, data: result.data, raw: result.raw },
    { status: result.ok ? 200 : 502 },
  );
}
