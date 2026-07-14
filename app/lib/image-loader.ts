"use client";

/**
 * Custom next/image loader (wired up in next.config.ts).
 *
 * Doctor photos come from two hosts and both were slow for the same reason:
 * every request went through Next's own optimizer, which first has to download
 * the full-size original from the origin before it can transcode anything.
 *
 *   bamc.myclinic.com.sa  306 doctors  409 KB, 1182x1182, ~2.8s to fetch
 *   res.cloudinary.com     47 doctors  19.5 KB, full-size (no width asked for)
 *
 * So we ask Cloudinary for the exact width instead, and let the browser hit its
 * CDN directly — no optimizer hop, no re-downloading a 409 KB JPEG to emit a
 * 4 KB thumbnail. Cloudinary's /image/fetch/ proxies the bamc originals without
 * needing any API credentials, and caches the result on its edge. A 320px card
 * photo goes 409 KB → ~4.7 KB WebP.
 *
 * Anything else (local /public assets, Vercel Blob, /api/uploads) keeps using
 * the built-in optimizer.
 */

// My Clinic's official media cloud — every doctor photo lives here, and it is
// where app/api/doctors/upload/route.ts sends new ones. Hardcoded rather than
// read from the env because this module runs in the browser (a cloud name is a
// public identifier; it appears in every image URL on the page).
const CLOUD_NAME = "ubhucgne";

const CLOUDINARY_DELIVERY = /^(https:\/\/res\.cloudinary\.com\/[^/]+)\/image\/upload\/(.+)$/;
const BAMC_ORIGIN = "https://bamc.myclinic.com.sa/";

// A Cloudinary transformation segment is a comma-separated list of `key_value`
// pairs ("f_auto,q_auto"). A public-id segment ("doctors") never looks like one,
// which is how we tell them apart.
const TRANSFORMATION_SEGMENT = /^[a-z]+_[^/,]+(?:,[a-z]+_[^/,]+)*$/;

/**
 * c_limit only ever scales down, so it cannot upscale a small original or crop
 * a face out of frame — the images keep the exact framing they have today.
 * q_auto lets Cloudinary pick the quality per image; it beats a fixed number.
 */
function transformation(width: number, quality?: number): string {
  return `f_auto,${quality ? `q_${quality}` : "q_auto"},c_limit,w_${width}`;
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
  // Next's optimizer REJECTS SVG unless dangerouslyAllowSVG is enabled, so an
  // <Image src="*.svg"> resolves to a /_next/image URL that 404s and renders as
  // a broken image — which is exactly what was happening to the footer and
  // dashboard logos. There is nothing to optimize in a vector file anyway:
  // serve it as-is. (Enabling dangerouslyAllowSVG instead would let the
  // optimizer run untrusted SVG from any allowlisted remote host.)
  if (src.endsWith(".svg")) return src;

  // Already on Cloudinary: rebuild the transformation with the width we need.
  const delivery = src.match(CLOUDINARY_DELIVERY);
  if (delivery) {
    const [, base, rest] = delivery;
    const segments = rest.split("/");
    // Drop the existing "f_auto,q_auto" so we resize instead of chaining a
    // second transformation onto it.
    if (segments.length > 1 && TRANSFORMATION_SEGMENT.test(segments[0])) segments.shift();
    return `${base}/image/upload/${transformation(width, quality)}/${segments.join("/")}`;
  }

  // The legacy image server: proxy it through Cloudinary, which resizes it once
  // and then serves every subsequent request from its own CDN.
  if (src.startsWith(BAMC_ORIGIN)) {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/${transformation(
      width,
      quality
    )}/${encodeURIComponent(src)}`;
  }

  // Everything else keeps the built-in Image Optimization API.
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
