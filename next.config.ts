import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
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
    ],
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
    ];
  },
  async headers() {
    return [
      {
        source: "/dental/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/clinic/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/doctors/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
