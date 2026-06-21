"use client";

/**
 * Infinite trust ticker under the hero — replaces the static 4-icon strip.
 * Pure CSS animation (translateX -50% on a duplicated track), pauses on
 * hover and disables under prefers-reduced-motion.
 */

const ITEMS = {
  en: [
    "+11 pediatric consultants",
    "Jeddah & Riyadh",
    "Board-certified team",
    "Gentle, kid-first care",
    "4.8/5 parent rating",
    "Vaccinations on schedule",
  ],
  ar: [
    "+11 استشاري أطفال",
    "جدة والرياض",
    "فريق معتمد",
    "رعاية لطيفة للأطفال",
    "تقييم الأهالي 4.8/5",
    "تطعيمات في موعدها",
  ],
};

export default function KidsMarquee({ lang }: { lang: "en" | "ar" }) {
  const items = ITEMS[lang];

  const Track = ({ hidden }: { hidden?: boolean }) => (
    <div className="kmq-track flex items-center shrink-0" aria-hidden={hidden}>
      {items.map((t, i) => (
        <span key={i} className="flex items-center shrink-0">
          <span className="px-6 md:px-8 font-headline font-extrabold text-[15px] md:text-base text-[#004d99] whitespace-nowrap">
            {t}
          </span>
          <svg className="w-4 h-4 text-[#FFC83D] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2c.5 4.5 2.5 6.5 7 7-4.5.5-6.5 2.5-7 7-.5-4.5-2.5-6.5-7-7 4.5-.5 6.5-2.5 7-7z" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <section className="relative bg-white border-y border-[#004d99]/8 overflow-hidden" dir="ltr">
      <style>{`
        /* Items enter from the right edge and travel leftwards — matches
           Arabic right-to-left reading; kept identical for English. */
        @keyframes kmq-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .kmq-rail { animation: kmq-scroll 28s linear infinite; }
        .kmq-rail:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .kmq-rail { animation: none; } }
      `}</style>
      <div className="kmq-rail flex w-max items-center py-4 md:py-5 will-change-transform">
        <Track />
        <Track hidden />
      </div>
      {/* Soft edge fades */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-28 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-28 bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </section>
  );
}
