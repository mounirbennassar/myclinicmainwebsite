"use client";
import dynamic from "next/dynamic";
import { useLang } from "@/app/i18n/context";
import { trackWhatsAppClick } from "@/app/lib/tracking";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import KidsHeroBg from "./components/KidsHeroBg";
import KidsHero, { WhatsAppIcon } from "./components/KidsHero";
import KidsMarquee from "./components/KidsMarquee";
import KidsPromises from "./components/KidsPromises";
import KidsServices from "./components/KidsServices";

// Below-fold sections load as separate chunks so the hero paints and
// hydrates first on slow mobile connections. The doctors strip alone
// carries the full doctors dataset.
const KidsDoctorsStrip = dynamic(() => import("./components/KidsDoctorsStrip"));
const KidsGallery = dynamic(() => import("./components/KidsGallery"));
const KidsTestimonials = dynamic(() => import("./components/KidsTestimonials"));
const KidsBookingForm = dynamic(() => import("./components/KidsBookingForm"));

const WHATSAPP_LINK = `https://wa.me/966920022811?text=${encodeURIComponent(
  "مرحباً، أود حجز موعد في قسم الأطفال بعيادتي"
)}`;

export default function KidsHub() {
  // No `ready` gate: the page prerenders fully in Arabic (the default) so
  // visitors get real content on first paint instead of a white screen.
  // If a returning visitor saved "en", the provider flips it right after mount.
  const { lang } = useLang();
  const isRtl = lang === "ar";

  const scrollToBooking = () =>
    document.getElementById("kids-booking")?.scrollIntoView({ behavior: "smooth" });

  const openWhatsApp = () => {
    trackWhatsAppClick();
    window.open(WHATSAPP_LINK, "_blank", "noopener,noreferrer");
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-white">
      <SiteNav />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <KidsHeroBg />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-20 pb-24 md:pb-32">
          <KidsHero lang={lang} onBookClick={scrollToBooking} onWhatsAppClick={openWhatsApp} />
        </div>
      </section>

      {/* ── Trust ticker ── */}
      <KidsMarquee lang={lang} />

      <KidsPromises lang={lang} />
      <KidsServices lang={lang} onBookClick={scrollToBooking} />
      <KidsDoctorsStrip />
      <KidsGallery />
      <KidsTestimonials />

      {/* ── CTA banner ── */}
      <section className="px-4 md:px-8 py-14 md:py-20">
        <div className="relative max-w-6xl mx-auto rounded-[3rem] bg-[#004d99] px-8 md:px-14 pt-14 pb-12 md:pt-16 md:pb-16 text-center overflow-hidden shadow-[0_40px_90px_-40px_rgba(0,77,153,0.65)]">
          {/* Soft teal glow + dot texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 70% at 85% 10%, rgba(0,103,125,0.55) 0%, rgba(0,103,125,0) 70%), radial-gradient(ellipse 50% 60% at 8% 90%, rgba(125,200,247,0.18) 0%, rgba(125,200,247,0) 70%)",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.35) 1.4px, transparent 1.5px)",
              backgroundSize: "26px 26px",
              maskImage: "radial-gradient(ellipse 70% 80% at 50% 0%, black 0%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 50% 0%, black 0%, transparent 75%)",
            }}
            aria-hidden
          />

          {/* Doodles */}
          <svg className="absolute top-8 left-8 md:left-12 w-16 text-[#FFC83D] opacity-80" viewBox="0 0 100 24" fill="none" aria-hidden>
            <path d="M2 14 Q 14 2 26 14 T 50 14 T 74 14 T 98 14" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          </svg>
          <svg className="absolute bottom-10 right-8 md:right-14 w-8 text-[#7DC8F7] opacity-90" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2c.5 4.5 2.5 6.5 7 7-4.5.5-6.5 2.5-7 7-.5-4.5-2.5-6.5-7-7 4.5-.5 6.5-2.5 7-7z" />
          </svg>
          <svg className="absolute top-12 right-[18%] w-5 text-white/50" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2c.5 4.5 2.5 6.5 7 7-4.5.5-6.5 2.5-7 7-.5-4.5-2.5-6.5-7-7 4.5-.5 6.5-2.5 7-7z" />
          </svg>

          <div className="relative">
            <h2 className={`font-headline text-3xl md:text-[2.75rem] font-extrabold text-white ${isRtl ? "" : "tracking-tight"} leading-[1.12] [text-wrap:balance]`}>
              {isRtl ? "صحّة طفلك تبدأ بزيارة واحدة" : "Your child's health starts with one visit"}
            </h2>
            <p className="mt-4 text-white/75 max-w-xl mx-auto leading-relaxed [text-wrap:pretty]">
              {isRtl
                ? "احجز الآن وسيتواصل معك فريقنا خلال ساعة في أوقات العمل."
                : "Book now and our team will reach out within an hour during working hours."}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={scrollToBooking}
                className="bg-white text-[#004d99] px-8 py-4 rounded-full font-extrabold shadow-[0_6px_0_#FFC83D] hover:-translate-y-0.5 hover:shadow-[0_8px_0_#FFC83D] active:translate-y-0.5 active:shadow-[0_2px_0_#FFC83D] transition-all cursor-pointer"
              >
                {isRtl ? "احجز موعد طفلك" : "Book your child's visit"}
              </button>
              <button
                onClick={openWhatsApp}
                className="px-7 py-4 bg-white/10 backdrop-blur text-white ring-2 ring-white/30 rounded-full font-bold hover:bg-white/20 hover:ring-white/50 transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5" />
                {isRtl ? "تواصل واتساب" : "WhatsApp us"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <KidsBookingForm />
      <SiteFooter />
    </div>
  );
}
