"use client";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/app/i18n/context";
import { trackPhoneClick } from "@/app/lib/tracking";

export default function DentalNav() {
  const { lang, setLang } = useLang();
  const isRtl = lang === "ar";
  return (
    <header className="sticky top-0 w-full z-50 bg-white/85 backdrop-blur-xl border-b border-[#003867]/10">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 md:px-8 py-3.5">
        <Link href="/dental" className="flex items-center gap-2">
          <Image src="/myclinic-frame-logo.webp" alt="My Clinic Dental" width={150} height={40} className="h-10 w-auto" preload />
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#003867]/5 text-[#003867] text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#003867]" />
            {isRtl ? "الأسنان" : "Dental"}
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center bg-slate-100 rounded-full overflow-hidden text-[11px] font-bold border border-slate-200">
            <button onClick={() => setLang("en")} className={`px-2.5 py-1.5 transition-all ${lang === "en" ? "bg-[#003867] text-white" : "text-slate-500"}`}>EN</button>
            <button onClick={() => setLang("ar")} className={`px-2.5 py-1.5 transition-all ${lang === "ar" ? "bg-[#003867] text-white" : "text-slate-500"}`}>AR</button>
          </div>
          <a href="tel:920022811" onClick={trackPhoneClick} className="hidden lg:flex items-center gap-2 text-[#003867] font-bold text-sm" dir="ltr">
            <span className="material-symbols-outlined text-lg">call</span>
            920 022 811
          </a>
          <a href="tel:920022811" onClick={trackPhoneClick} className="flex lg:hidden items-center justify-center w-9 h-9 rounded-full bg-[#003867]/5 text-[#003867]" aria-label="Call">
            <span className="material-symbols-outlined text-lg">call</span>
          </a>
          <button
            onClick={() => document.getElementById("dental-booking")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-[#003867] hover:bg-[#002a4d] text-white px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold shadow-lg shadow-[#003867]/25 active:scale-95 transition-colors"
          >
            {isRtl ? "احجز موعد" : "Book Appointment"}
          </button>
        </div>
      </div>
    </header>
  );
}
