import type { Metadata } from "next";

// Kids / Pediatrics landing page. Shares the root LangProvider + brand fonts
// from app/layout.tsx; this layout only adds page-specific SEO metadata and a
// light chrome wrapper.
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

export default function KidsLayout({ children }: { children: React.ReactNode }) {
  return <div className="font-body antialiased">{children}</div>;
}
