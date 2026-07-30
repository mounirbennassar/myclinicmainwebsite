import type { MetadataRoute } from "next";
import { getAllDoctorSlugs } from "@/app/lib/doctors";
import { getPublishedPosts } from "@/app/lib/content";

const ORIGIN = "https://myclinic.com.sa";

// Regenerated daily; DB/backend failures degrade to the static routes rather
// than failing the build (getPublishedPosts already swallows fetch errors).
export const revalidate = 86400;

// Public routes with real content. Alias/legacy paths (/pediatrice, /privacy)
// and redirect sources are left out — a sitemap should list canonical URLs.
const STATIC_ROUTES = [
  "/",
  "/find-doctor",
  "/specialties",
  "/dental",
  "/pediatric",
  "/women-care",
  "/health-homecare",
  "/about-us",
  "/contact",
  "/feedback",
  "/blog",
  "/news",
  "/privacy-policy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [doctorSlugs, blog, news] = await Promise.all([
    getAllDoctorSlugs().catch(() => [] as string[]),
    getPublishedPosts("blog"),
    getPublishedPosts("news"),
  ]);

  return [
    ...STATIC_ROUTES.map((path) => ({ url: `${ORIGIN}${path}` })),
    ...doctorSlugs.map((slug) => ({ url: `${ORIGIN}/doctors/${slug}` })),
    ...blog.map((post) => ({
      url: `${ORIGIN}/blog/${post.slug}`,
      lastModified: post.published_at ?? undefined,
    })),
    ...news.map((post) => ({
      url: `${ORIGIN}/news/${post.slug}`,
      lastModified: post.published_at ?? undefined,
    })),
  ];
}
