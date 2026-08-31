import type { Metadata } from "next";

// My360 landing page. Shares the root LangProvider + brand fonts from
// app/layout.tsx; this layout only adds page-specific SEO metadata.
export const metadata: Metadata = {
  title: "My 360 — Simply Better Living | عيادتي 360 My Clinic",
  description:
    "One clinic. One dedicated care team. My 360 by My Clinic is a family of proactive care programs — Diabetes, Grow (0–18), Live (19–64) and Thrive (65+) — with a Consultant, Program GP and Care Coordinator on every plan. No membership fees. عيادتي 360: برامج رعاية صحية استباقية لكل مرحلة من حياتك — بدون رسوم اشتراك. اتصل 920022811.",
  alternates: { canonical: "/my360" },
  openGraph: {
    title: "My 360 · عيادتي 360 — Simply Better Living | My Clinic",
    description:
      "برامج رعاية صحية استباقية من عيادتي — برنامج التحكم بالسكري، وبرنامج رحلة طفلك (0–18)، وبرنامج حياة (19–64)، وبرنامج حياة متجددة (65+). A personalized health journey that adapts to you at every age.",
    images: [{ url: "/myclinic-frame-logo.webp", width: 800, height: 400, alt: "My Clinic | عيادتي" }],
    locale: "ar_SA",
    type: "website",
  },
};

export default function My360Layout({ children }: { children: React.ReactNode }) {
  return <div className="font-body antialiased">{children}</div>;
}
