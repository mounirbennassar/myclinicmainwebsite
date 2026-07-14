import type { Metadata } from "next";

import { DoctorsProvider } from "@/app/components/DoctorsProvider";
import { getDoctorsBySpecialty } from "@/app/lib/doctors";

// Kids / Pediatrics landing page. Shares the root LangProvider + brand fonts
// from app/layout.tsx; this layout adds page-specific SEO metadata, a light
// chrome wrapper, and the pediatricians the strip renders.
//
// They used to come from the hardcoded app/doctors-data.ts (11 of them, frozen
// in March) and so could not be edited in the CMS. Reading them here — a server
// component — keeps the names in the SSR HTML.
export const metadata: Metadata = {
  title: "My Clinic Kids | عيادتي للأطفال — رعاية طبية متكاملة للأطفال",
  description:
    "قسم الأطفال في عيادتي — رعاية طبية لطيفة ومتكاملة لطفلك على يد نخبة من استشاريي طب الأطفال في جدة والرياض. تطعيمات، متابعة نمو، حساسية، وأكثر. احجز الآن 920022811. My Clinic Kids — gentle, comprehensive pediatric care by top consultants in Jeddah & Riyadh.",
  openGraph: {
    title: "My Clinic Kids | عيادتي للأطفال",
    description:
      "رعاية طبية لطيفة ومتكاملة لطفلك على يد نخبة من استشاريي طب الأطفال في جدة والرياض. احجز الآن 920022811.",
    images: [{ url: "/kids/hero.jpg", width: 1240, height: 1550, alt: "My Clinic Kids" }],
    locale: "ar_SA",
    type: "website",
  },
};

// Backstop only — doctor mutations call revalidatePath("/", "layout").
export const revalidate = 3600;

export default async function KidsLayout({ children }: { children: React.ReactNode }) {
  const pediatricians = await getDoctorsBySpecialty("Pediatrics", null).catch(() => []);

  return (
    <div className="font-body antialiased">
      <DoctorsProvider doctors={pediatricians}>{children}</DoctorsProvider>
    </div>
  );
}
