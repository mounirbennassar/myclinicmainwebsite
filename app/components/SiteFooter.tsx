"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/app/i18n/context";
import { trackPhoneClick, trackWhatsAppClick } from "@/app/lib/tracking";

const PHONE_TEL = "920022811";
const PHONE_DISPLAY = "920 022 811";
const WHATSAPP_LINK = `https://wa.me/966920022811?text=${encodeURIComponent("مرحباً، أود حجز موعد في عيادتي")}`;

const SOCIALS = [
  { href: "https://www.instagram.com/myclinicksa/", icon: "fa-instagram", label: "Instagram" },
  { href: "https://www.tiktok.com/@myclinic_ksa", icon: "fa-tiktok", label: "TikTok" },
  { href: "https://www.linkedin.com/company/myclinicksa/", icon: "fa-linkedin-in", label: "LinkedIn" },
  { href: "https://www.facebook.com/MyClinicKSA/", icon: "fa-facebook-f", label: "Facebook" },
  { href: "https://www.youtube.com/channel/UCzD7SKMrFnKCZywENykDPCA", icon: "fa-youtube", label: "YouTube" },
];

export default function SiteFooter() {
  const { lang } = useLang();
  const isRtl = lang === "ar";

  const quickLinks = [
    { href: "/", en: "Home", ar: "الرئيسية" },
    { href: "/find-a-doctor", en: "Find a Doctor", ar: "ابحث عن طبيب" },
    { href: "/specialties", en: "Specialties", ar: "التخصصات" },
    { href: "/about-us", en: "About Us", ar: "من نحن" },
    { href: "/contact", en: "Contact", ar: "تواصل معنا" },
  ];

  const serviceLinks = [
    { href: "/health-homecare", en: "Home Healthcare", ar: "الرعاية المنزلية" },
    { href: "/telemedicine", en: "Telemedicine", ar: "الطب عن بُعد" },
    { href: "/dental", en: "Dental Care", ar: "طب الأسنان" },
    { href: "/pediatric", en: "Pediatrics", ar: "طب الأطفال" },
  ];

  const label = (l: { en: string; ar: string }) => (isRtl ? l.ar : l.en);

  return (
    <footer className="w-full bg-[#0b1f3a] text-white/80">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="space-y-5">
            <Image src="/logo-dark.svg" alt="My Clinic" width={150} height={40} className="h-9 w-auto brightness-0 invert" />
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              {isRtl
                ? "رعاية صحية متعددة التخصصات في جدة والرياض — أكثر من 27 تخصصاً و100 طبيب، بتجربة واحدة متكاملة."
                : "Premium multispecialty healthcare across Jeddah & Riyadh — 27+ specialties, 100+ doctors, one connected experience."}
            </p>
            <div className="flex gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-secondary-fixed-dim hover:text-[#0b1f3a] transition-colors"
                >
                  <i className={`fa-brands ${s.icon} text-sm`} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-headline font-bold text-sm uppercase tracking-widest mb-5">{isRtl ? "روابط سريعة" : "Quick Links"}</h3>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors">{label(l)}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-headline font-bold text-sm uppercase tracking-widest mb-5">{isRtl ? "الخدمات" : "Services"}</h3>
            <ul className="space-y-3">
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors">{label(l)}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div className="space-y-5">
            <h3 className="text-white font-headline font-bold text-sm uppercase tracking-widest">{isRtl ? "تواصل معنا" : "Get in Touch"}</h3>
            <a href={`tel:${PHONE_TEL}`} onClick={trackPhoneClick} dir="ltr" className="flex items-center gap-3 text-sm text-white/80 hover:text-white transition-colors w-fit">
              <span className="material-symbols-outlined text-lg text-secondary-fixed-dim">call</span>
              {PHONE_DISPLAY}
            </a>
            <a href={WHATSAPP_LINK} onClick={trackWhatsAppClick} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-white/80 hover:text-white transition-colors w-fit">
              <i className="fa-brands fa-whatsapp text-lg text-[#25D366]" />
              {isRtl ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
            </a>
            <div className="flex items-start gap-3 text-sm text-white/60">
              <span className="material-symbols-outlined text-lg text-secondary-fixed-dim">location_on</span>
              <span>{isRtl ? "جدة والرياض، المملكة العربية السعودية" : "Jeddah & Riyadh, Saudi Arabia"}</span>
            </div>
            <div className="flex gap-3 pt-1">
              <a href="https://apps.apple.com/us/app/my-clinic-ksa/id1475630623" target="_blank" rel="noopener noreferrer">
                <Image src="/Download_on_the_App_Store.png" alt="Download on the App Store" width={120} height={36} className="h-9 w-auto" />
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.myclinic.ksa" target="_blank" rel="noopener noreferrer">
                <Image src="/Get_it_on_playstore.png" alt="Get it on Google Play" width={120} height={36} className="h-9 w-auto" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">&copy; {isRtl ? "2026 عيادتي. جميع الحقوق محفوظة." : "2026 My Clinic. All rights reserved."}</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="text-xs text-white/50 hover:text-white transition-colors">{isRtl ? "الخصوصية" : "Privacy"}</Link>
            <Link href="/terms" className="text-xs text-white/50 hover:text-white transition-colors">{isRtl ? "الشروط والأحكام" : "Terms"}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
