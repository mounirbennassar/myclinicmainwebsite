import type { Metadata } from "next";

// Contact page. Shares the root LangProvider + brand fonts from app/layout.tsx;
// this layout only adds page-specific SEO metadata.
export const metadata: Metadata = {
  title: "Contact Us | تواصل معنا — عيادتي My Clinic",
  description:
    "تواصل مع عيادتي في جدة والرياض — اتصل على 920022811، أو راسلنا على info@myclinic.com.sa، أو عبّئ نموذج التواصل وسيعاود فريقنا الاتصال بك. Get in touch with My Clinic — call 920022811, email info@myclinic.com.sa, or send us a message.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact My Clinic | تواصل مع عيادتي",
    description:
      "اتصل على 920022811 أو راسلنا على info@myclinic.com.sa — فريق عيادتي جاهز لمساعدتك في جدة والرياض.",
    images: [{ url: "/myclinic-frame-logo.webp", width: 800, height: 400, alt: "My Clinic | عيادتي" }],
    locale: "ar_SA",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <div className="font-body antialiased">{children}</div>;
}
