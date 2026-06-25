import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Specialties | التخصصات الطبية — عيادتي My Clinic",
  description:
    "Explore 27+ medical specialties at My Clinic — from cardiology and dermatology to pediatrics, orthopedics and more, across Jeddah & Riyadh. اكتشف أكثر من 27 تخصصاً طبياً في عيادتي.",
  alternates: { canonical: "/specialties" },
  openGraph: {
    title: "Medical Specialties | التخصصات الطبية — عيادتي My Clinic",
    description: "Explore 27+ medical specialties at My Clinic across Jeddah & Riyadh.",
    images: [{ url: "/myclinic-frame-logo.webp", width: 800, height: 400, alt: "My Clinic | عيادتي" }],
    locale: "ar_SA",
    type: "website",
  },
};

export default function SpecialtiesLayout({ children }: { children: React.ReactNode }) {
  return <div className="font-body antialiased">{children}</div>;
}
