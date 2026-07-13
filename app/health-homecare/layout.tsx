import type { Metadata } from "next";

// Health Homecare page. Shares the root LangProvider + brand fonts from
// app/layout.tsx; this layout only adds page-specific SEO metadata.
export const metadata: Metadata = {
  title: "Telehome — Home & Virtual Care in Jeddah & Riyadh | عيادتي My Clinic",
  description:
    "Telehome by My Clinic: start with a teleconsultation, then care comes to you — lab tests, medication delivery, nursing, physiotherapy and doctor visits at home. تيلي هوم من عيادتي: استشارة طبية عن بُعد، ثم ننسّق ما تحتاجه من تحاليل منزلية، وتوصيل أدوية، وتمريض، وعلاج طبيعي، وزيارات طبيب في جدة والرياض.",
  alternates: { canonical: "/health-homecare" },
  openGraph: {
    title: "Telehome · تيلي هوم — Home & Virtual Care | عيادتي My Clinic",
    description:
      "رعاية متكاملة تبدأ باستشارة طبية عن بُعد، وتمتد إلى خدمات منزلية تناسب احتياجك. Your clinic, wherever you are — a teleconsultation, then nursing, labs, medication and doctor visits brought to your door across Jeddah & Riyadh.",
    images: [{ url: "/myclinic-frame-logo.webp", width: 800, height: 400, alt: "My Clinic | عيادتي" }],
    locale: "ar_SA",
    type: "website",
  },
};

export default function HealthHomecareLayout({ children }: { children: React.ReactNode }) {
  return <div className="font-body antialiased">{children}</div>;
}
