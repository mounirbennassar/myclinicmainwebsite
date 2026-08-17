import type { Metadata } from "next";

// My360 landing page. Shares the root LangProvider + brand fonts from
// app/layout.tsx; this layout only adds page-specific SEO metadata.
export const metadata: Metadata = {
  title: "My360 — Proactive Health Programs | عيادتي 360 My Clinic",
  description:
    "My360 by My Clinic — premium, proactive health programs for every stage of life: Grow (0–18), Live (19–64), Thrive (65+) and Diabetes. Prevention, early detection and coordinated specialist care from one dedicated team. عيادتي 360: برامج رعاية صحية استباقية لكل مرحلة من حياتك — الوقاية والكشف المبكر والرعاية المنسقة مع فريق طبي مخصص. اتصل 920022811.",
  alternates: { canonical: "/my360" },
  openGraph: {
    title: "My360 · عيادتي 360 — Proactive Health Programs | My Clinic",
    description:
      "برامج رعاية صحية استباقية من عيادتي — جرو (0–18)، ليف (19–64)، ثرايف (65+)، وبرنامج السكري. Prevention, early detection and coordinated care for every stage of life.",
    images: [{ url: "/myclinic-frame-logo.webp", width: 800, height: 400, alt: "My Clinic | عيادتي" }],
    locale: "ar_SA",
    type: "website",
  },
};

export default function My360Layout({ children }: { children: React.ReactNode }) {
  return <div className="font-body antialiased">{children}</div>;
}
