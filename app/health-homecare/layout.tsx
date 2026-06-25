import type { Metadata } from "next";

// Health Homecare page. Shares the root LangProvider + brand fonts from
// app/layout.tsx; this layout only adds page-specific SEO metadata.
export const metadata: Metadata = {
  title: "Home Healthcare Services in Jeddah & Riyadh | عيادتي My Clinic",
  description:
    "Get quality medical care at home. My Clinic offers home visits, medication delivery, lab tests, and virtual care—personalized to your needs. احصل على رعاية طبية عالية الجودة في منزلك — زيارات منزلية للطبيب والممرض، علاج طبيعي وفحوصات مخبرية في جدة والرياض.",
  alternates: { canonical: "/health-homecare" },
  openGraph: {
    title: "Home Healthcare | الرعاية الصحية المنزلية — عيادتي My Clinic",
    description:
      "زيارات منزلية للطبيب والممرض، علاج طبيعي وفحوصات مخبرية في راحة منزلك. Doctor & nurse home visits, physiotherapy and lab tests at home across Jeddah & Riyadh.",
    images: [{ url: "/myclinic-frame-logo.webp", width: 800, height: 400, alt: "My Clinic | عيادتي" }],
    locale: "ar_SA",
    type: "website",
  },
};

export default function HealthHomecareLayout({ children }: { children: React.ReactNode }) {
  return <div className="font-body antialiased">{children}</div>;
}
