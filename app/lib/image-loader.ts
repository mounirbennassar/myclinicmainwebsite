"use client";

/**
 * Custom next/image loader (wired up in next.config.ts).
 *
 * EVERY raster image is delivered by Cloudinary, resized to the exact width
 * the layout asks for. There are two reasons, and both are load-bearing:
 *
 * 1. Perf — doctor photos come from bamc.myclinic.com.sa (409 KB, 1182x1182,
 *    ~2.8s) and Cloudinary (full-size originals). Asking Cloudinary for the
 *    exact width serves a ~4.7 KB WebP straight off its CDN edge instead of
 *    making an optimizer re-download the original per request.
 *
 * 2. Self-hosting — with a custom loader configured, a self-hosted Next 16
 *    server does NOT register the /_next/image route at all
 *    (next-server.js: `loader !== 'default' → render404`). It only works on
 *    Vercel because their edge optimizer intercepts the URL before the Next
 *    server sees it. So on the NourNet VM every /_next/image URL 404s and
 *    renders as a broken image — the loader must never emit one.
 *
 * Local /public assets therefore go through Cloudinary's /image/fetch/ proxy,
 * which pulls them from ASSET_ORIGIN once, resizes, and caches on its edge.
 */

// My Clinic's official media cloud — every doctor photo lives here, and it is
// where app/api/doctors/upload/route.ts sends new ones. Hardcoded rather than
// read from the env because this module runs in the browser (a cloud name is a
// public identifier; it appears in every image URL on the page).
const CLOUD_NAME = "ubhucgne";

// Public origin Cloudinary fetches /public assets from. Must be one canonical
// host (not window.location.origin) so server-rendered and hydrated srcsets
// match. The apex is the NourNet VM's nginx, which serves this repo's /public.
const ASSET_ORIGIN =
  process.env.NEXT_PUBLIC_ASSET_ORIGIN || "https://myclinic.com.sa";

const CLOUDINARY_DELIVERY = /^(https:\/\/res\.cloudinary\.com\/[^/]+)\/image\/upload\/(.+)$/;

// A Cloudinary transformation segment is a comma-separated list of `key_value`
// pairs ("f_auto,q_auto"). A public-id segment ("doctors") never looks like one,
// which is how we tell them apart.
const TRANSFORMATION_SEGMENT = /^[a-z]+_[^/,]+(?:,[a-z]+_[^/,]+)*$/;

/**
 * c_limit only ever scales down, so it cannot upscale a small original or crop
 * a face out of frame — the images keep the exact framing they have today.
 * q_auto lets Cloudinary pick the quality per image; it beats a fixed number.
 *
 * `flattenWhite` composites transparency onto white. Many doctor portraits are
 * cut-outs saved with an alpha channel; f_auto keeps the alpha (it ships PNG or
 * WebP), so whatever sits behind the <img> shows through — which is why some
 * profiles read as a black or circular backdrop. Adding b_white makes
 * Cloudinary flatten onto white and deliver JPEG instead.
 *
 * Scoped to doctor portraits ONLY. Applied globally it would wreck every logo
 * and icon that is deliberately transparent.
 */
function transformation(width: number, quality?: number, flattenWhite = false): string {
  return `f_auto,${quality ? `q_${quality}` : "q_auto"},c_limit,w_${width}${flattenWhite ? ",b_white" : ""}`;
}

/** Doctor portraits: Cloudinary `doctors/…` public ids and the /public fallback avatars. */
function isDoctorPortrait(src: string): boolean {
  return /(^|\/)doctors\//.test(src) || /\/av-(man|woman)-mycliinic\.png$/.test(src);
}

function cloudinaryFetch(absoluteUrl: string, width: number, quality?: number): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/${transformation(
    width,
    quality,
    isDoctorPortrait(absoluteUrl)
  )}/${encodeURIComponent(absoluteUrl)}`;
}

export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // Nothing to optimize in a vector file, and Cloudinary's fetch of untrusted
  // SVG is as unwelcome as the built-in optimizer's: serve it as-is.
  if (src.endsWith(".svg") || src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }

  // Already on Cloudinary: rebuild the transformation with the width we need.
  const delivery = src.match(CLOUDINARY_DELIVERY);
  if (delivery) {
    const [, base, rest] = delivery;
    const segments = rest.split("/");
    // Drop the existing "f_auto,q_auto" so we resize instead of chaining a
    // second transformation onto it.
    if (segments.length > 1 && TRANSFORMATION_SEGMENT.test(segments[0])) segments.shift();
    const publicId = segments.join("/");
    return `${base}/image/upload/${transformation(width, quality, isDoctorPortrait(publicId))}/${publicId}`;
  }

  // Local /public assets. Cloudinary cannot reach localhost, so dev serves the
  // raw file (fine — no optimizer runs in dev with a custom loader anyway).
  if (src.startsWith("/")) {
    if (process.env.NODE_ENV === "development") return src;
    return cloudinaryFetch(`${ASSET_ORIGIN}${src}`, width, quality);
  }

  // Any other absolute URL (e.g. bamc.myclinic.com.sa): proxy it through
  // Cloudinary, which resizes it once and then serves every subsequent
  // request from its own CDN.
  return cloudinaryFetch(src, width, quality);
}
