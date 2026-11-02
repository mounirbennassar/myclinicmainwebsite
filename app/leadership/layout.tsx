import type { Metadata } from "next";

// Leadership page. Shares the root LangProvider + brand fonts from app/layout.tsx;
// this layout only adds page-specific SEO metadata.
export const metadata: Metadata = {
  title: "Leadership | القيادة — My Clinic",
  description:
    "تعرف على فريق القيادة في عيادتي. Meet the leadership team guiding My Clinic across Jeddah & Riyadh.",
  alternates: { canonical: "/leadership" },
  openGraph: {
    title: "Leadership | القيادة — My Clinic",
    description:
      "تعرف على فريق القيادة في عيادتي. Meet the leadership team guiding My Clinic across Jeddah & Riyadh.",
    images: [{ url: "/myclinic-frame-logo.webp", width: 800, height: 400, alt: "My Clinic | عيادتي" }],
    locale: "ar_SA",
    type: "website",
  },
};

export default function LeadershipLayout({ children }: { children: React.ReactNode }) {
  return <div className="font-body antialiased">{children}</div>;
}
