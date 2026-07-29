import { createHash } from "node:crypto";
import { DOCTOR_ROLES, HttpError, errorResponse, requireRoles } from "@/app/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Must stay below nginx's client_max_body_size (25m in deploy/nginx/
// myclinic.conf) so an oversize file fails HERE with a clean 400 instead of
// nginx's opaque 413. The dashboard downscales images client-side (see
// downscaleImage in app/dashboard/doctors/page.tsx), so in practice uploads
// arrive well under this; it's the backstop for anything that skips that path.
const MAX_BYTES = 4 * 1024 * 1024;
const FOLDER = "doctors";

// My Clinic's official media cloud. Every doctor photo lives here under
// doctors/<slug>, delivered through f_auto,q_auto. Uploads go to Cloudinary
// rather than a container's local disk so photos survive rebuilds and are
// served resized from its CDN edge (see app/lib/image-loader.ts).
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "ubhucgne";

/** Cloudinary signs the alphabetically-sorted params, then appends the secret. */
function sign(params: Record<string, string>, apiSecret: string): string {
  const canonical = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(canonical + apiSecret).digest("hex");
}

export async function POST(request: Request) {
  try {
    await requireRoles(...DOCTOR_ROLES);

    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!apiKey || !apiSecret) {
      throw new HttpError(500, "Image uploads are not configured (missing Cloudinary credentials)");
    }

    const file = (await request.formData()).get("file");
    if (!(file instanceof File)) throw new HttpError(400, "No file was uploaded");
    if (!file.type.startsWith("image/")) throw new HttpError(400, "Only image files are allowed");
    if (file.size > MAX_BYTES) throw new HttpError(400, "Image must be under 4 MB");

    const timestamp = String(Math.floor(Date.now() / 1000));
    const signed = { folder: FOLDER, timestamp };

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", apiKey);
    form.append("folder", signed.folder);
    form.append("timestamp", signed.timestamp);
    form.append("signature", sign(signed, apiSecret));

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.public_id) {
      throw new HttpError(502, data?.error?.message || "Cloudinary rejected the upload");
    }

    // Build the delivery URL rather than using `secure_url`, so it carries the
    // same f_auto,q_auto transformation as every photo already in the DB.
    return Response.json({
      url: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${data.public_id}`,
    });
  } catch (err) {
    return errorResponse(err);
  }
}
