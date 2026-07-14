import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker image (see Dockerfile).
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Doctor photos are served straight off Cloudinary's CDN at the exact width
    // each layout asks for, instead of making the optimizer re-download a
    // 409 KB original to emit a 4 KB thumbnail. See app/lib/image-loader.ts —
    // it falls back to the built-in optimizer for every other image.
    loader: "custom",
    loaderFile: "./app/lib/image-loader.ts",
    formats: ["image/avif", "image/webp"],
    // Next 16 defaults images.qualities to [75] and coerces any other value.
    // Declare every quality the app actually requests so nothing is downgraded.
    qualities: [55, 70, 72, 75, 78, 80, 86],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200, 1440, 1920, 2048],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 192, 256, 320, 420],
    // Still enforced for anything the loader hands back to the built-in
    // optimizer (Vercel Blob, /api/uploads). Cloudinary + bamc bypass it.
    remotePatterns: [
      {
        // Doctor profile photos from the clinic's legacy image server.
        protocol: "https",
        hostname: "bamc.myclinic.com.sa",
      },
      {
        // Dashboard image uploads (Vercel Blob).
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        // Doctor photos + CMS media (Cloudinary).
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // /api/auth/* and /api/doctors/* are served by Next route handlers (app/api/),
  // so the doctors CMS works on any host — including Vercel, where there is no
  // FastAPI process. Everything below is still owned by FastAPI (backend/) and
  // is proxied to it; the rewrite keeps the API same-origin so the session
  // cookie just rides along. Both sides read the same Postgres and sign the same
  // HS256 JWT with JWT_SECRET, so a session minted by either is valid for both.
  //
  // These must stay an explicit prefix list rather than a blanket /api/:path*:
  // an array returned here is applied as `afterFiles`, which is matched BEFORE
  // dynamic routes — a catch-all would shadow app/api/doctors/[id]/route.ts.
  async rewrites() {
    const backend = process.env.BACKEND_ORIGIN || "http://127.0.0.1:8020";
    const fastapiOwned = ["appointments", "team", "utm", "content", "whatsapp", "uploads"];
    // Both forms: the bare collection (`/api/team`, which the dashboard calls)
    // and everything under it (`/api/team/<id>`).
    return fastapiOwned.flatMap((prefix) => [
      { source: `/api/${prefix}`, destination: `${backend}/api/${prefix}` },
      { source: `/api/${prefix}/:path*`, destination: `${backend}/api/${prefix}/:path*` },
    ]);
  },
  async redirects() {
    return [
      // /contact-us is a common alias that shows up in ads and external links —
      // redirect it to the canonical /contact page instead of 404ing.
      // NOTE: lp also redirects /pediatrice→/pediatric and /privacy→/privacy-policy,
      // but those are intentionally omitted here because this site still serves its
      // own /pediatrice and /privacy pages.
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      // The women's-health landing page's slug evolved:
      // /female-family-medicine → /female-medicine → /women-care.
      // Keep every old URL alive for existing links, ads and search indexes.
      {
        source: "/female-family-medicine",
        destination: "/women-care",
        permanent: true,
      },
      {
        source: "/female-medicine",
        destination: "/women-care",
        permanent: true,
      },
      // The standalone Telemedicine page was retired (2026-07-12); its offering
      // is covered by /health-homecare ("Tele-consultation and Home care").
      // Redirect rather than 404 so ads, external links and search keep working.
      {
        source: "/telemedicine",
        destination: "/health-homecare",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Long-cache every static asset served from /public (images, video,
        // fonts) regardless of folder — replaces the previous per-folder rules
        // (/dental, /clinic, /doctors) which left /kids, /team, /female-family
        // and the root logos uncached. Assets are treated as immutable: upload
        // a new filename when content changes.
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|mp4|webm|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
