import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker image (see Dockerfile).
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Next 16 defaults images.qualities to [75] and coerces any other value.
    // Declare every quality the app actually requests so nothing is downgraded.
    qualities: [55, 70, 72, 75, 78, 80, 86],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200, 1440, 1920, 2048],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 192, 256, 320, 420],
    remotePatterns: [
      {
        // Doctor profile photos from the clinic's image server.
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
  // Every /api/* request is served by the FastAPI backend (backend/). The
  // rewrite keeps the API same-origin so the session cookie just rides along.
  async rewrites() {
    const backend = process.env.BACKEND_ORIGIN || "http://127.0.0.1:8020";
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`,
      },
    ];
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
