"use client";
import { useLang } from "@/app/i18n/context";

/*
 * Google reviews as a design-v2 marquee: header row with an eyebrow + the
 * aggregate rating card, then an auto-scrolling track of review cards. The
 * track is CSS-driven (zero per-frame JS), pauses on hover, and is duplicated
 * once so the -50% keyframe loops seamlessly. Reviews are the clinic's real
 * Google reviews.
 */
const REVIEWS = [
  {
    initials: "MA",
    name: "Modi Abdullah",
    en: "“The center is a spacious, well-designed building with numerous services. The signage and layout of the various departments are very attractive and modern.”",
    ar: "«المجمع مبنى واسع ومصمم بشكل جميل مع خدمات متعددة. اللوحات الإرشادية وتوزيع الأقسام جذاب وعصري جداً.»",
  },
  {
    initials: "LJ",
    name: "Lina JI",
    en: "“Honestly, ‘My Clinic’ is outstanding in its service and responsiveness. The staff is professional, and the facility is spotless.”",
    ar: "«بصراحة، عيادتي متميز في خدمته واستجابته. الكادر محترف والمنشأة نظيفة جداً.»",
  },
  {
    initials: "RA",
    name: "Raghad Al-Ghamdi",
    en: "“We can all agree that a clinic that is clean, quiet, and comfortable for the patient is very important — and I experienced exactly that at My Clinic.”",
    ar: "«كلنا متفقين أن العيادة النظيفة والهادئة والمريحة للمريض أمر مهم جداً، وهذا بالضبط ما عشته في عيادتي.»",
  },
];

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.86c2.26-2.09 3.58-5.16 3.58-8.81z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.86-3a7.24 7.24 0 0 1-10.8-3.81H1.29v3.09A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.29a12 12 0 0 0 0 10.74l3.99-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.97 11.97 0 0 0 1.29 6.63l3.99 3.09A7.24 7.24 0 0 1 12 4.75z" />
    </svg>
  );
}

function Stars({ size = 15 }: { size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24" fill="#F8B037">
          <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9 2.9-6Z" />
        </svg>
      ))}
    </span>
  );
}

export default function DentalTestimonials() {
  const { lang } = useLang();
  const isRtl = lang === "ar";

  return (
    <section className="relative py-20 md:py-28 bg-[#F2F6FA] overflow-hidden">
      <style>{`
        @keyframes dtm-marquee-ltr { to { transform: translateX(-50%); } }
        @keyframes dtm-marquee-rtl { to { transform: translateX(50%); } }
        .dtm-track { animation: dtm-marquee-ltr 80s linear infinite; }
        .dtm-shell[dir="rtl"] .dtm-track { animation-name: dtm-marquee-rtl; }
        .dtm-shell:hover .dtm-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .dtm-track { animation: none; } }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-4 md:mb-6">
          <div className="dv-reveal max-w-[560px]">
            <span className="flex items-center gap-3 text-[#004d99] font-bold text-[13px] md:text-sm tracking-[0.05em] mb-4">
              <span className="w-[30px] h-[2px] bg-[#004d99]" aria-hidden />
              {isRtl ? "تقييمات قوقل" : "Google reviews"}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#003868] tracking-tight leading-[1.4]">
              {isRtl ? (
                <>ثقتكم... <span className="text-[#004d99]">أعظم إنجازاتنا</span></>
              ) : (
                <>Your trust is <span className="text-[#004d99]">our greatest achievement</span></>
              )}
            </h2>
            <p className="mt-4 text-base md:text-[16.5px] text-[#3D434D] leading-[1.9]">
              {isRtl
                ? "نفخر بكل ابتسامة غادرت عيادتي بثقة أكبر، وبكل كلمة شاركها مراجعونا عن تجربتهم معنا."
                : "We're proud of every smile that left My Clinic more confident, and of every word our patients share about their experience."}
            </p>
          </div>

          <div className="dv-reveal flex items-center gap-4 bg-white rounded-[18px] shadow-[0_10px_30px_-12px_rgba(0,56,104,0.25)] px-6 py-4">
            <span className="text-[42px] font-extrabold text-[#003868] leading-none" dir="ltr">4.8</span>
            <span>
              <Stars />
              <span className="block text-[12.5px] text-[#797C82] mt-1">
                {isRtl ? "من واقع تقييمات المرضى على Google" : "Based on patient reviews on Google"}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Marquee — follows the page direction so the first review is the first
          thing readers see. Each half repeats the reviews 3× so the track is
          wider than any viewport (no blank region), and the inter-half gap
          lives INSIDE each half (margin-inline-end) so the 50% loop point is
          pixel-exact — no jump, no seam. */}
      <div
        className="dtm-shell overflow-hidden pt-6 pb-2"
        style={{
          maskImage: "linear-gradient(to right, transparent 0, black 32px, black calc(100% - 32px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0, black 32px, black calc(100% - 32px), transparent 100%)",
        }}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="dtm-track flex w-max will-change-transform">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex gap-5 shrink-0 me-5" aria-hidden={dup === 1}>
              {[...REVIEWS, ...REVIEWS, ...REVIEWS].map((r, i) => (
                <div
                  key={i}
                  dir={isRtl ? "rtl" : "ltr"}
                  className="w-[320px] md:w-[360px] shrink-0 bg-white rounded-[20px] p-6 md:p-7 shadow-[0_10px_30px_-14px_rgba(0,56,104,0.28)]"
                >
                  <div className="flex justify-between items-center mb-4">
                    <Stars />
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#F2F6FA" stroke="#004d99" strokeWidth="1.4" aria-hidden>
                      <path d="M10 8c-3 .5-5 2.5-5 5.5V19h6v-6H8c0-2 1-3 3-3.5V8h-1ZM19 8c-3 .5-5 2.5-5 5.5V19h6v-6h-3c0-2 1-3 3-3.5V8h-1Z" />
                    </svg>
                  </div>
                  <p className="text-[15px] leading-[1.95] text-[#3D434D] mb-4 min-h-[86px]">{isRtl ? r.ar : r.en}</p>
                  <div className="flex items-center gap-3 border-t border-[#E3E6EA] pt-4">
                    <span className="w-[42px] h-[42px] rounded-full bg-[#F2F6FA] text-[#003868] font-bold inline-flex items-center justify-center">
                      {r.initials}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[14.5px] font-bold text-[#003868]">{r.name}</span>
                      <span className="block text-[12.5px] text-[#797C82]">{isRtl ? "مراجعة Google" : "Google review"}</span>
                    </span>
                    <GoogleG className="w-5 h-5 shrink-0 opacity-80" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="dv-reveal max-w-7xl mx-auto px-4 md:px-8 mt-8 text-center">
        <p className="text-[15px] text-[#797C82] leading-relaxed max-w-2xl mx-auto">
          {isRtl
            ? "نفخر بثقة مراجعينا، ونسعد بأن تكون تجاربهم انعكاساً لما نؤمن به من جودة واهتمام ورعاية استثنائية."
            : "We take pride in our patients' trust, and we're glad their experiences reflect what we believe in: quality, attention, and exceptional care."}
        </p>
      </div>
    </section>
  );
}
