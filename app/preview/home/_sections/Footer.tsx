"use client";

import Image from "next/image";
import Link from "next/link";
import { BrandIcon, WhatsAppIcon } from "@/app/components/icons";
import { trackPhoneClick, trackWhatsAppClick } from "@/app/lib/tracking";
import { COPY, PHONE_DISPLAY, PHONE_TEL, pick, whatsappLink } from "../_lib/content";
import { scrollToId } from "../_lib/motion";
import { Arrow, PhoneIcon } from "./ui";

const SOCIALS = [
  { href: "https://www.instagram.com/myclinicksa/", brand: "fa-instagram", label: "Instagram" },
  { href: "https://www.tiktok.com/@myclinic_ksa", brand: "fa-tiktok", label: "TikTok" },
  { href: "https://www.linkedin.com/company/myclinicksa/", brand: "fa-linkedin-in", label: "LinkedIn" },
  { href: "https://www.facebook.com/MyClinicKSA/", brand: "fa-facebook-f", label: "Facebook" },
  { href: "https://www.youtube.com/channel/UCzD7SKMrFnKCZywENykDPCA", brand: "fa-youtube", label: "YouTube" },
];

const EXPLORE = [
  { href: "/find-doctor", en: "Find a Doctor", ar: "ابحث عن طبيب" },
  { href: "/specialties", en: "Specialties", ar: "التخصصات" },
  { href: "/about-us", en: "About Us", ar: "من نحن" },
  { href: "/blog", en: "Blog", ar: "المدونة" },
  { href: "/contact", en: "Contact", ar: "تواصل معنا" },
  { href: "/feedback", en: "Feedback & Complaints", ar: "الملاحظات والشكاوى" },
];

const SERVICES = [
  { href: "/my360", en: "My360", ar: "عيادتي 360" },
  { href: "/health-homecare", en: "Telehome · Home Care", ar: "تيلي هوم · الرعاية المنزلية" },
  { href: "/dental", en: "Dental Care", ar: "طب الأسنان" },
  { href: "/pediatric", en: "Pediatrics", ar: "طب الأطفال" },
  { href: "/women-care", en: "Women's Health", ar: "صحة المرأة" },
];

export default function Footer({ isRtl }: { isRtl: boolean }) {
  const label = (l: { en: string; ar: string }) => (isRtl ? l.ar : l.en);
  return (
    <footer className="bg-ink text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 pt-20 sm:pt-28 pb-10">
        <div className="grid md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="md:col-span-5 flex flex-col gap-8">
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo */}
            <img src="/home-v2/logo-white.svg" alt="My Clinic" width={130} height={48} className="h-12 w-auto self-start" />
            <p data-rv="" className="rv display text-3xl sm:text-[2.6rem] leading-[1.1] max-w-[440px]">{pick(COPY.footerStatement, isRtl)}</p>
            <button type="button" onClick={() => scrollToId("booking")} className="btn btn-light inline-flex items-center gap-4 rounded-full ps-6 pe-1.5 py-1.5 text-sm font-semibold w-fit cursor-pointer">
              {pick(COPY.bookAppointment, isRtl)}
              <span className="arrow w-10 h-10 rounded-full bg-primary text-white grid place-items-center">
                <Arrow />
              </span>
            </button>
          </div>

          <nav className="md:col-span-2 flex flex-col gap-3 text-sm text-white/65" aria-label={pick(COPY.explorePages, isRtl)}>
            <span className="eyebrow text-[10px] text-white/40 mb-2">{pick(COPY.explorePages, isRtl)}</span>
            {EXPLORE.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors w-fit">
                {label(l)}
              </Link>
            ))}
          </nav>

          <nav className="md:col-span-2 flex flex-col gap-3 text-sm text-white/65" aria-label={pick(COPY.services, isRtl)}>
            <span className="eyebrow text-[10px] text-white/40 mb-2">{pick(COPY.services, isRtl)}</span>
            {SERVICES.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors w-fit">
                {label(l)}
              </Link>
            ))}
          </nav>

          <div className="md:col-span-3 flex flex-col gap-4 text-sm text-white/70">
            <span className="eyebrow text-[10px] text-white/40 mb-1">{pick(COPY.getInTouch, isRtl)}</span>
            <a href={`tel:${PHONE_TEL}`} onClick={trackPhoneClick} className="flex items-center gap-3 hover:text-white transition-colors w-fit">
              <PhoneIcon className="w-4 h-4 text-glow" />
              <span dir="ltr">{PHONE_DISPLAY}</span>
            </a>
            <a href={whatsappLink(isRtl)} onClick={trackWhatsAppClick} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors w-fit">
              <WhatsAppIcon className="text-base text-[#25D366]" />
              {isRtl ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
            </a>
            <p className="text-white/50">{pick(COPY.location, isRtl)}</p>
            <div className="flex gap-2 pt-1">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-white/15 grid place-items-center text-white/75 hover:bg-white hover:text-ink transition-colors duration-500"
                >
                  <BrandIcon name={s.brand} className="text-sm" />
                </a>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <a href="https://apps.apple.com/us/app/my-clinic-ksa/id1475630623" target="_blank" rel="noopener noreferrer">
                <Image src="/Download_on_the_App_Store.png" alt="Download on the App Store" width={120} height={36} className="h-9 w-auto" />
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.myclinic.ksa" target="_blank" rel="noopener noreferrer">
                <Image src="/Get_it_on_playstore.png" alt="Get it on Google Play" width={120} height={36} className="h-9 w-auto" />
              </a>
            </div>
          </div>
        </div>

        {/* Oversized wordmark that rises as the page ends */}
        <div className="relative overflow-hidden pt-10" aria-hidden="true">
          <p data-parallax="14" className="display text-center leading-none text-white/[0.06] text-[21vw] lg:text-[17rem] select-none whitespace-nowrap">
            {isRtl ? "عيادتي" : "My Clinic"}
          </p>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between gap-4 text-xs text-white/45">
          <span>&copy; {isRtl ? "2026 عيادتي. جميع الحقوق محفوظة." : "2026 My Clinic. All rights reserved."}</span>
          <span className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              {isRtl ? "الخصوصية" : "Privacy"}
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              {isRtl ? "الشروط والأحكام" : "Terms"}
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
