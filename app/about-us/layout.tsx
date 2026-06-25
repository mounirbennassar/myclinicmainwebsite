import type { Metadata } from "next";

// About Us page. Shares the root LangProvider + brand fonts from app/layout.tsx;
// this layout only adds page-specific SEO metadata.
export const metadata: Metadata = {
  title: "About Us | عن عيادتي — My Clinic",
  description:
    "تعرّف على عيادتي — مجموعة عيادات متخصصة تأسست عام 2017 تحت إشراف مجموعة ناظر، بأكثر من 24 تخصصاً و300 متخصص في الرعاية الصحية في جدة والرياض. About My Clinic — multispecialty outpatient care established in 2017, with 24+ specialties and 300+ healthcare professionals across Jeddah & Riyadh.",
  alternates: { canonical: "/about-us" },
  openGraph: {
    title: "About My Clinic | عن عيادتي",
    description:
      "مجموعة عيادات متخصصة تأسست عام 2017 — أكثر من 24 تخصصاً و300 متخصص في جدة والرياض. Multispecialty care since 2017, 24+ specialties & 300+ professionals.",
    images: [{ url: "/myclinic-frame-logo.webp", width: 800, height: 400, alt: "My Clinic | عيادتي" }],
    locale: "ar_SA",
    type: "website",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <div className="font-body antialiased">{children}</div>;
}
