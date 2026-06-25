import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Telemedicine | الطب عن بُعد — عيادتي My Clinic",
  description:
    "Consult My Clinic's specialist doctors by video from anywhere in Saudi Arabia. Secure online consultations, e-prescriptions, lab referrals and follow-ups. استشارات طبية عن بُعد بالفيديو مع نخبة الأطباء — وصفات إلكترونية ومتابعة آمنة.",
  alternates: { canonical: "/telemedicine" },
  openGraph: {
    title: "Telemedicine | الطب عن بُعد — عيادتي My Clinic",
    description: "Secure video consultations with My Clinic specialists, e-prescriptions and follow-ups.",
    images: [{ url: "/myclinic-frame-logo.webp", width: 800, height: 400, alt: "My Clinic | عيادتي" }],
    locale: "ar_SA",
    type: "website",
  },
};

export default function TelemedicineLayout({ children }: { children: React.ReactNode }) {
  return <div className="font-body antialiased">{children}</div>;
}
