import type { Metadata } from "next";

// Leadership page — PREVIEW, awaiting management approval.
// Hidden on purpose: noindex/nofollow, not in sitemap.ts, not linked from
// SiteNav/SiteFooter. It is deliberately NOT listed in robots.ts either, since
// a Disallow line would publish the path. page.tsx also 404s without the
// preview key. To launch: remove the key gate in page.tsx, drop `robots` below, add
// "/leadership" to STATIC_ROUTES in app/sitemap.ts, link it from the nav/footer,
// and replace the placeholder portraits in public/leadership/.
export const metadata: Metadata = {
  title: "Leadership | القيادة — My Clinic",
  description:
    "تعرف على فريق القيادة في عيادتي. Meet the leadership team guiding My Clinic across Jeddah & Riyadh.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function LeadershipLayout({ children }: { children: React.ReactNode }) {
  return <div className="font-body antialiased">{children}</div>;
}
