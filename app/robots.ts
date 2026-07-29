import type { MetadataRoute } from "next";

// Served at /robots.txt. The portal subdomain already noindexes itself via
// X-Robots-Tag (proxy.ts), so this only has to describe the public site.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/login", "/api/"],
      },
    ],
    sitemap: "https://myclinic.com.sa/sitemap.xml",
  };
}
