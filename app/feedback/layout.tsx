import type { Metadata } from "next";

// Feedback & Complaints page. Shares the root LangProvider + brand fonts from
// app/layout.tsx; this layout only adds page-specific SEO metadata.
export const metadata: Metadata = {
  title: "Feedback & Complaints | الملاحظات والشكاوى — عيادتي My Clinic",
  description:
    "شاركنا رأيك أو قدم شكوى — فريق تجربة المرضى في عيادتي يتابع كل ملاحظة حتى الحل خلال 48 ساعة. Share your feedback or file a complaint — My Clinic's patient experience team follows every case through to resolution.",
  alternates: { canonical: "/feedback" },
  openGraph: {
    title: "Feedback & Complaints | الملاحظات والشكاوى — عيادتي",
    description:
      "رأيك يصنع الفرق — قدم ملاحظتك أو شكواك وسيتابعها فريق تجربة المرضى حتى الحل.",
    images: [{ url: "/myclinic-frame-logo.webp", width: 800, height: 400, alt: "My Clinic | عيادتي" }],
    locale: "ar_SA",
    type: "website",
  },
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return <div className="font-body antialiased">{children}</div>;
}
