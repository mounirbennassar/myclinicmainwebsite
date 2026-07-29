import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker image (see Dockerfile).
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // ALL raster images are served off Cloudinary's CDN at the exact width each
    // layout asks for — see app/lib/image-loader.ts. The loader must never emit
    // /_next/image URLs: with a custom loader, a self-hosted Next server does
    // not register that route (404s), it only works behind Vercel's edge.
    loader: "custom",
    loaderFile: "./app/lib/image-loader.ts",
    formats: ["image/avif", "image/webp"],
    // Next 16 defaults images.qualities to [75] and coerces any other value.
    // Declare every quality the app actually requests so nothing is downgraded.
    qualities: [55, 70, 72, 75, 78, 80, 86],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200, 1440, 1920, 2048],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 192, 256, 320, 420],
    // Unused while the custom loader is active (nothing reaches the built-in
    // optimizer); kept so re-enabling it can't open an unrestricted proxy.
    remotePatterns: [
      {
        // Doctor profile photos from the clinic's legacy image server.
        protocol: "https",
        hostname: "bamc.myclinic.com.sa",
      },
      {
        // Doctor photos + CMS media (Cloudinary).
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // /api/auth/*, /api/doctors/*, /api/team/*, /api/appointments and
  // /api/revalidate are served by Next route handlers (app/api/) — login, the
  // doctors CMS, team management, the public booking form and cache purging
  // live in the web/portal containers themselves. The prefixes below are owned
  // by FastAPI (backend/) and are proxied to it; the rewrite keeps the API
  // same-origin so the session cookie just rides along. Both sides read the
  // same Postgres and sign the same HS256 JWT with JWT_SECRET, so a session
  // minted by either is valid for both.
  //
  // These must stay an explicit prefix list rather than a blanket /api/:path*:
  // an array returned here is applied as `afterFiles`, which is matched BEFORE
  // dynamic routes — a catch-all would shadow app/api/doctors/[id]/route.ts.
  async rewrites() {
    const backend = process.env.BACKEND_ORIGIN || "http://127.0.0.1:8020";
    const fastapiOwned = ["utm", "content", "whatsapp", "uploads"];
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
