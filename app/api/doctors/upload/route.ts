import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

// Image upload for doctor photos → Vercel Blob (returns a public URL stored in
// doctors.image_url). Requires a Blob store: Vercel → Storage → Blob, which sets
// BLOB_READ_WRITE_TOKEN automatically. Gated by the proxy.
export const runtime = "nodejs";

export async function POST(request: Request) {
  const role = request.headers.get("x-user-role");
  if (role !== "super_admin" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Image storage isn't configured. Create a Vercel Blob store, or paste an image URL instead." },
      { status: 503 }
    );
  }
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be under 8 MB" }, { status: 400 });
    }
    const safe = file.name.replace(/[^a-zA-Z0-9.]+/g, "-").toLowerCase();
    const blob = await put(`doctors/${Date.now()}-${safe}`, file, { access: "public" });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("Doctor image upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
