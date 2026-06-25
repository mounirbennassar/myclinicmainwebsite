import type { Metadata } from "next";

// Shares the root LangProvider + brand fonts; adds page-specific SEO metadata.
export const metadata: Metadata = {
  title: "Find a Doctor | ابحث عن طبيب — عيادتي My Clinic",
  description:
    "Search 100+ specialist doctors across 27 specialties at My Clinic in Jeddah & Riyadh. Filter by specialty and city, view profiles and book an appointment. ابحث بين أكثر من 100 طبيب متخصص في عيادتي — حسب التخصص والمدينة.",
  alternates: { canonical: "/find-a-doctor" },
  openGraph: {
    title: "Find a Doctor | ابحث عن طبيب — عيادتي My Clinic",
    description:
      "Search and filter 100+ specialist doctors at My Clinic across Jeddah & Riyadh.",
    images: [{ url: "/myclinic-frame-logo.webp", width: 800, height: 400, alt: "My Clinic | عيادتي" }],
    locale: "ar_SA",
    type: "website",
  },
};

export default function FindADoctorLayout({ children }: { children: React.ReactNode }) {
  return <div className="font-body antialiased">{children}</div>;
}
