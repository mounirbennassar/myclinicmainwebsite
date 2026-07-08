import type { Metadata } from "next";

// Women & Family Medicine landing page. Shares the root LangProvider + brand
// fonts from app/layout.tsx; this layout only adds page-specific SEO metadata.
export const metadata: Metadata = {
  title: "Women's Health | صحة المرأة — عيادتي My Clinic",
  description:
    "رعاية متكاملة لصحة المرأة في عيادتي — متابعة الحمل والولادة، أمراض النساء، الفحوصات الدورية، رعاية الأم والطفل والصحة الإنجابية على أيدي نخبة من الاستشاريات المتخصصات في جدة والرياض. احجزي موعدك 920022811. Comprehensive women's healthcare — pregnancy, gynecology, screenings and reproductive care by our specialists in Jeddah & Riyadh.",
  alternates: { canonical: "/female-family-medicine" },
  openGraph: {
    title: "Women's Health | صحة المرأة — عيادتي My Clinic",
    description:
      "رعاية دقيقة ومتكاملة لصحة المرأة في كل مرحلة، بخصوصية تامة على أيدي نخبة من الاستشاريات المتخصصات. احجزي موعدك 920022811.",
    images: [{ url: "/female-family/hero.webp", width: 940, height: 940, alt: "صحة المرأة — عيادتي My Clinic" }],
    locale: "ar_SA",
    type: "website",
  },
};

export default function FemaleFamilyMedicineLayout({ children }: { children: React.ReactNode }) {
  return <div className="font-body antialiased">{children}</div>;
}
