"use client";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/app/i18n/context";
import { trackPhoneClick } from "@/app/lib/tracking";

export default function KidsNav() {
  const { lang, setLang } = useLang();
  const isRtl = lang === "ar";
  return (
    <header className="sticky top-0 w-full z-50 bg-white/85 backdrop-blur-xl border-b border-[#004d99]/10">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 md:px-8 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/myclinic-frame-logo.webp" alt="My Clinic Kids" width={150} height={40} className="h-10 w-auto" priority />
          <span className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-sky-400/15 to-amber-300/20 text-[#004d99] font-bold ${isRtl ? "text-[11px]" : "text-[10px] uppercase tracking-wider"}`}>
            <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>child_care</span>
            {isRtl ? "الأطفال" : "Kids"}
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center bg-slate-100 rounded-full overflow-hidden text-[11px] font-bold border border-slate-200">
            <button onClick={() => setLang("en")} className={`px-2.5 py-1.5 transition-all ${lang === "en" ? "bg-[#004d99] text-white" : "text-slate-500"}`}>EN</button>
            <button onClick={() => setLang("ar")} className={`px-2.5 py-1.5 transition-all ${lang === "ar" ? "bg-[#004d99] text-white" : "text-slate-500"}`}>AR</button>
          </div>
          <a href="tel:920022811" onClick={trackPhoneClick} className="hidden lg:flex items-center gap-2 text-[#004d99] font-bold text-sm" dir="ltr">
            <span className="material-symbols-outlined text-lg">call</span>
            920 022 811
          </a>
          <a href="tel:920022811" onClick={trackPhoneClick} className="flex lg:hidden items-center justify-center w-9 h-9 rounded-full bg-[#004d99]/5 text-[#004d99]" aria-label="Call">
            <span className="material-symbols-outlined text-lg">call</span>
          </a>
          <button
            onClick={() => document.getElementById("kids-booking")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-[#004d99] text-white px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-extrabold shadow-[0_3px_0_#FFC83D] hover:-translate-y-0.5 hover:shadow-[0_5px_0_#FFC83D] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            {isRtl ? "احجز موعد" : "Book Appointment"}
          </button>
        </div>
      </div>
    </header>
  );
}
