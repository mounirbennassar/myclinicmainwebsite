"use client";

import { useState } from "react";
import { useLang } from "@/app/i18n/context";

/*
 * Patient-experience videos, pulled from the clinic's real YouTube channel
 * (youtube.com/channel/UC1GF_U6EyvDRUm6VM7MESmQ). Rendered as facades — a
 * thumbnail + play button — and the iframe only mounts on click, so the page
 * never pays YouTube's embed cost up front. Thumbnails are plain <img> tags on
 * i.ytimg.com: they must not go through the Cloudinary fetch loader.
 */
const VIDEOS: { id: string; ar: string; en: string }[] = [
  { id: "FOKzZYl6TfM", ar: "التخدير الواعي في طب الأسنان", en: "Conscious sedation in dentistry" },
  { id: "kRuPNMAaIMs", ar: "د. شهد أبو داود — استشاري طب أسنان الأطفال", en: "Dr. Shahad Abu Dawood — Pediatric dentistry consultant" },
  { id: "VTxxIc2Ut5s", ar: "د. إياد فتحي — أخصائي تركيبات وتجميل الأسنان", en: "Dr. Eyad Fathi — Prosthodontics & cosmetic dentistry" },
  { id: "OAwv7POU1I4", ar: "د. حسن عابد — استشاري طب أسنان الرعاية الخاصة", en: "Dr. Hassan Abed — Special-care dentistry consultant" },
];

function VideoCard({
  video,
  featured,
  isRtl,
}: {
  video: { id: string; ar: string; en: string };
  featured: boolean;
  isRtl: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const title = isRtl ? video.ar : video.en;

  return (
    <figure
      className={`dv-reveal group relative rounded-[20px] overflow-hidden bg-[#0b1f3a] shadow-[0_18px_42px_-18px_rgba(0,56,104,0.35)] ring-1 ring-[#003868]/10 ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      <div className="relative aspect-video w-full h-full">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full text-start cursor-pointer"
            aria-label={title}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- YouTube CDN thumb, must bypass the Cloudinary loader */}
            <img
              src={`https://i.ytimg.com/vi/${video.id}/${featured ? "maxresdefault" : "hqdefault"}.jpg`}
              alt={title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-[#0b1f3a]/85 via-[#0b1f3a]/15 to-transparent" aria-hidden />
            {/* Play button */}
            <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
              <span className={`relative flex items-center justify-center rounded-full bg-white/90 backdrop-blur text-[#004d99] shadow-xl transition-transform duration-300 group-hover:scale-110 ${featured ? "w-20 h-20" : "w-14 h-14"}`}>
                <span className="absolute inset-0 rounded-full border border-white/60 animate-ping opacity-40" />
                <svg width={featured ? 28 : 20} height={featured ? 28 : 20} viewBox="0 0 24 24" fill="currentColor" className={isRtl ? "-scale-x-100 -translate-x-0.5" : "translate-x-0.5"}>
                  <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                </svg>
              </span>
            </span>
            <figcaption className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              <span className={`block font-bold text-white leading-snug drop-shadow ${featured ? "text-base md:text-lg" : "text-[13px] md:text-sm"}`}>
                {title}
              </span>
            </figcaption>
          </button>
        )}
      </div>
    </figure>
  );
}

export default function DentalVideos() {
  const { lang } = useLang();
  const isRtl = lang === "ar";

  return (
    <section className="py-20 md:py-28 bg-[#0b1f3a] relative overflow-hidden">
      {/* Flower watermarks echoing the brand */}
      <img src="/dental/flower-white.png" alt="" className={`absolute -top-10 ${isRtl ? "-left-10" : "-right-10"} w-40 opacity-[0.07] pointer-events-none select-none`} aria-hidden />
      <img src="/dental/flower-white.png" alt="" className={`absolute -bottom-14 ${isRtl ? "-right-12" : "-left-12"} w-36 opacity-[0.05] pointer-events-none select-none`} aria-hidden />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div className="dv-reveal text-center max-w-[640px] mx-auto mb-12 md:mb-14">
          <span className="inline-flex items-center justify-center gap-3 text-[#9ec5ff] font-bold text-[13px] md:text-sm tracking-[0.05em]">
            <span className="w-[26px] h-[2px] bg-[#9ec5ff]" aria-hidden />
            {isRtl ? "مقاطع فيديو لتجربة المراجع" : "Patient experience videos"}
            <span className="w-[26px] h-[2px] bg-[#9ec5ff]" aria-hidden />
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-[40px] font-extrabold text-white tracking-tight leading-[1.4]">
            {isRtl ? "تجربة تتجاوز العلاج" : "An experience beyond treatment"}
          </h2>
          <p className="mt-4 text-base md:text-[16.5px] text-white/70 leading-[1.9]">
            {isRtl
              ? "في عيادتي، تبدأ التجربة منذ لحظة وصولكم، حيث صُمم كل تفصيل بعناية ليمنحكم شعوراً بالراحة والطمأنينة."
              : "At My Clinic the experience begins the moment you arrive — every detail is carefully designed to leave you feeling calm and reassured."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 md:auto-rows-fr">
          {VIDEOS.map((v, i) => (
            <VideoCard key={v.id} video={v} featured={i === 0} isRtl={isRtl} />
          ))}
        </div>

        <div className="dv-reveal mt-10 text-center">
          <p className="text-[15px] text-white/60 mb-4">
            {isRtl ? "أعجبتك التجربة؟ عيشها بنفسك." : "Like what you see? Experience it yourself."}
          </p>
          <button
            type="button"
            onClick={() => document.getElementById("dental-booking")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold bg-white text-[#003868] hover:bg-[#E9F1F8] shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M8 2v4M16 2v4M3 8h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
            </svg>
            {isRtl ? "احجز موعدك الآن" : "Book your visit now"}
          </button>
        </div>
      </div>
    </section>
  );
}
