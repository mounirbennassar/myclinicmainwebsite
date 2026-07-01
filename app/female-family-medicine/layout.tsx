import type { Metadata } from "next";

// Women & Family Medicine landing page. Shares the root LangProvider + brand
// fonts from app/layout.tsx; this layout only adds page-specific SEO metadata.
export const metadata: Metadata = {
  title: "Women & Family Medicine | طب المرأة والأسرة — عيادتي My Clinic",
  description:
    "رعاية متكاملة للمرأة والأسرة في عيادتي — متابعة الحمل والولادة، أمراض النساء، الفحوصات الدورية، رعاية الأم والطفل وطب الأسرة على أيدي نخبة من الطبيبات المتخصصات في جدة والرياض. احجزي موعدك 920022811. Comprehensive women's & family healthcare — pregnancy, gynecology, screenings and primary care by our specialists in Jeddah & Riyadh.",
  alternates: { canonical: "/female-family-medicine" },
  openGraph: {
    title: "Women & Family Medicine | طب المرأة والأسرة — عيادتي My Clinic",
    description:
      "رعاية دقيقة ومتكاملة للمرأة والأسرة في كل مرحلة، بخصوصية تامة على أيدي نخبة من الطبيبات المتخصصات. احجزي موعدك 920022811.",
    images: [{ url: "/female-family/hero.webp", width: 940, height: 940, alt: "طب المرأة والأسرة — عيادتي My Clinic" }],
    locale: "ar_SA",
    type: "website",
  },
};

export default function FemaleFamilyMedicineLayout({ children }: { children: React.ReactNode }) {
  return <div className="font-body antialiased">{children}</div>;
}
