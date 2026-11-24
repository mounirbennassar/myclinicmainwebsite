"use client";

import "./home-v2.css";
import { DM_Sans } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/app/i18n/context";
import { trackPhoneClick, trackWhatsAppClick } from "@/app/lib/tracking";
import type { DoctorCard } from "@/app/lib/doctors";
import { BRANCHES, PHONE_TEL, PROGRAMS, pick, whatsappLink } from "./_lib/content";
import { scrollToId, useHomeMotion } from "./_lib/motion";
import Header from "./_sections/Header";
import Hero from "./_sections/Hero";
import { SeamTicker, Stats, Ticker } from "./_sections/Stats";
import { BrandMarkSprite } from "./_sections/BrandMark";
import Specialties from "./_sections/Specialties";
import Services from "./_sections/Services";
import Programs from "./_sections/Programs";
import Doctors from "./_sections/Doctors";
import Experience from "./_sections/Experience";
import Locations from "./_sections/Locations";
import Stories from "./_sections/Stories";
import Booking from "./_sections/Booking";
import Footer from "./_sections/Footer";
import { PhoneIcon } from "./_sections/ui";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-dmsans" });

/**
 * v2 home page — the v5 editorial design carrying the live site's content.
 * Internal preview only (see app/preview/home/page.tsx for the access gate).
 *
 * Layout contract for ScrollSmoother: everything fixed (header, floating
 * actions, preview badge) sits OUTSIDE #hv2-wrapper; everything that scrolls
 * sits inside #hv2-content.
 */
export default function NewHome({ initialDoctors }: { initialDoctors?: DoctorCard[] }) {
  const { lang } = useLang();
  const isRtl = lang === "ar";
  const rootRef = useRef<HTMLDivElement>(null);
  const [bookingCity, setBookingCity] = useState("");

  useHomeMotion(rootRef, isRtl);

  // Same UTM capture the live home runs, so preview traffic attributes alike.
  useEffect(() => {
    import("@/app/lib/utm-client").then((m) => m.captureAndTrackUtm()).catch(() => {});
  }, []);

  const bookAt = (city: string) => {
    setBookingCity(city);
    scrollToId("booking");
  };

  return (
    <div ref={rootRef} className={`hv2 ${dmSans.variable} w-full`}>
      <BrandMarkSprite />
      <Header />

      <div id="hv2-wrapper">
        <div id="hv2-content" className="overflow-x-clip">
          <main id="main">
            <Hero isRtl={isRtl} />
            <Stats isRtl={isRtl} doctorCount={initialDoctors?.length ?? 0} />
            <Ticker isRtl={isRtl} />
            <Specialties isRtl={isRtl} />
            <Services isRtl={isRtl} />
            {/* Seam tickers: transparent bands laid across a light→dark edge */}
            <SeamTicker isRtl={isRtl} items={PROGRAMS.map((p) => pick(p.name, isRtl))} reverse />
            <Programs isRtl={isRtl} />
            <Doctors isRtl={isRtl} initialDoctors={initialDoctors} />
            <Experience isRtl={isRtl} />
            <SeamTicker isRtl={isRtl} items={BRANCHES.map((b) => pick(b.name, isRtl))} />
            <Locations isRtl={isRtl} onBook={bookAt} />
            <Stories isRtl={isRtl} />
            <Booking isRtl={isRtl} city={bookingCity} setCity={setBookingCity} />
          </main>
          <Footer isRtl={isRtl} />
        </div>
      </div>

      {/* Floating actions — appear once the hero is behind you */}
      <div data-hv2-fabs="" data-show="false" className="hv2-fabs fixed bottom-5 end-5 z-40 flex flex-col items-center gap-3">
        <a href={`tel:${PHONE_TEL}`} onClick={trackPhoneClick} aria-label={isRtl ? "اتصل بنا" : "Call us"} className="w-[52px] h-[52px] rounded-full bg-ink text-white grid place-items-center shadow-xl shadow-ink/25 hover:bg-primary transition-colors duration-500">
          <PhoneIcon className="w-5 h-5" />
        </a>
        <a
          href={whatsappLink(isRtl)}
          onClick={trackWhatsAppClick}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={isRtl ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
          className="w-[52px] h-[52px] rounded-full bg-[#25D366] text-white grid place-items-center shadow-xl shadow-[#25D366]/30 hover:scale-105 transition-transform duration-500"
        >
          <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white" aria-hidden="true">
            <path d="M16.004 0C7.165 0 .004 7.161.004 16c0 2.822.737 5.561 2.137 7.978L.003 32l8.207-2.108A15.926 15.926 0 0 0 16.004 32C24.843 32 32 24.839 32 16S24.843 0 16.004 0zm0 29.09a13.05 13.05 0 0 1-6.64-1.813l-.476-.283-4.933 1.267 1.313-4.79-.31-.494A13.008 13.008 0 0 1 2.914 16c0-7.221 5.869-13.09 13.09-13.09S29.094 8.779 29.094 16s-5.869 13.09-13.09 13.09zm7.175-9.803c-.393-.197-2.326-1.148-2.687-1.279-.362-.131-.625-.197-.888.197s-1.02 1.279-1.25 1.542-.462.296-.855.099c-.393-.197-1.66-.612-3.163-1.95-1.17-1.043-1.96-2.33-2.19-2.723-.229-.393-.024-.605.172-.8.177-.177.393-.462.59-.693.197-.23.262-.394.393-.656.131-.262.066-.492-.033-.689-.099-.197-.888-2.14-1.217-2.93-.32-.769-.646-.665-.888-.677-.229-.011-.492-.014-.755-.014s-.69.099-1.05.492c-.362.394-1.381 1.35-1.381 3.293s1.414 3.82 1.611 4.083c.197.262 2.783 4.248 6.743 5.957.942.407 1.677.65 2.25.832.946.3 1.806.258 2.486.157.758-.113 2.326-.951 2.655-1.869.328-.918.328-1.705.23-1.869-.099-.164-.362-.262-.755-.46z" />
          </svg>
        </a>
      </div>

    </div>
  );
}
