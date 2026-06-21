"use client";
import { useRef } from "react";
import Image from "next/image";
import { useLang } from "@/app/i18n/context";

type Branch = {
  name: string;
  nameAr: string;
  city: string;
  cityAr: string;
  image: string;
  mapUrl: string;
  isDental: boolean;
  isRiyadh: boolean;
  isTahlia?: boolean;
  label?: string;
  labelAr?: string;
};

const BRANCHES: Branch[] = [
  { name: "Al Sahafa", nameAr: "الصحافة", city: "Riyadh", cityAr: "الرياض", image: "/clinic/riyadh.webp", mapUrl: "https://maps.app.goo.gl/5XEWuSVKVzkJNyWt6", isDental: false, isRiyadh: true },
  { name: "Al Khalidiyyah", nameAr: "الخالدية", city: "Jeddah", cityAr: "جدة", label: "Dental Clinic", labelAr: "عيادة الأسنان", image: "/clinic/branch-khalidiyyah-building.webp", mapUrl: "https://maps.app.goo.gl/exmYNncSGTQAfDzV6", isDental: true, isRiyadh: false },
  { name: "Al Mohammadiyah", nameAr: "المحمدية", city: "Jeddah", cityAr: "جدة", image: "/clinic/branch-mohammadiyah-building.webp", mapUrl: "https://www.google.com/maps/place/My+Clinic/@21.6589018,39.1224875,17z", isDental: false, isRiyadh: false },
  { name: "Al Safa", nameAr: "الصفا", city: "Jeddah", cityAr: "جدة", image: "/clinic/safa.webp", mapUrl: "https://maps.app.goo.gl/zWd9vWV6m6Sukb956", isDental: false, isRiyadh: false },
  { name: "Al Tahlia", nameAr: "التحلية", city: "Jeddah", cityAr: "جدة", image: "/clinic/branch-tahlia-building.webp", mapUrl: "https://maps.app.goo.gl/ST25xhT8Hpe8PZp87", isDental: false, isRiyadh: false, isTahlia: true },
  { name: "Obhour", nameAr: "أبحر", city: "Jeddah", cityAr: "جدة", image: "/clinic/branch-obhour-building.webp", mapUrl: "https://maps.app.goo.gl/vmem2gxxNnHzv4q17", isDental: false, isRiyadh: false },
];

export default function DentalLocations() {
  const { lang } = useLang();
  const isRtl = lang === "ar";
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: "prev" | "next") => {
    const c = scroller.current;
    if (!c) return;
    const cardWidth = c.querySelector<HTMLElement>(":scope > a")?.offsetWidth || 360;
    const forward = dir === "next" ? 1 : -1;
    const rtlFactor = isRtl ? -1 : 1;
    c.scrollBy({ left: forward * rtlFactor * (cardWidth + 24), behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-[#003867]/[0.04] overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-12 md:mb-14">
          <div className="text-center flex-1">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#003867]/10 text-[#003867] text-[11px] font-bold uppercase tracking-widest">
              {isRtl ? "فروعنا" : "Our Locations"}
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {isRtl ? "اختر الفرع الأقرب إليك" : "Find the closest branch"}
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto font-medium">
              {isRtl
                ? "اكتشف فروع عيادتي واختر الموقع الأنسب لك ولعائلتك."
                : "Discover our My Clinic locations and choose the one that suits you and your family."}
            </p>
          </div>
          <div className="hidden md:flex gap-3 shrink-0 pb-1">
            <button onClick={() => scroll("prev")} className="w-11 h-11 bg-white rounded-full shadow-md flex items-center justify-center text-[#003867] hover:bg-[#003867] hover:text-white transition-all hover:scale-110 border border-[#003867]/10" aria-label="Previous">
              <span className="material-symbols-outlined">{isRtl ? "chevron_right" : "chevron_left"}</span>
            </button>
            <button onClick={() => scroll("next")} className="w-11 h-11 bg-white rounded-full shadow-md flex items-center justify-center text-[#003867] hover:bg-[#003867] hover:text-white transition-all hover:scale-110 border border-[#003867]/10" aria-label="Next">
              <span className="material-symbols-outlined">{isRtl ? "chevron_left" : "chevron_right"}</span>
            </button>
          </div>
        </div>

        <div className="relative">
          <div ref={scroller} className="flex overflow-x-scroll snap-x snap-mandatory gap-6 pb-6 md:pb-8 hide-scrollbar" style={{ scrollBehavior: "smooth" }}>
            {BRANCHES.map((b, i) => (
              <a
                key={i}
                href={b.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[320px] sm:w-[360px] snap-start shrink-0 bg-white rounded-2xl overflow-hidden shadow-lg shadow-[#003867]/5 group block border border-[#003867]/10 hover:shadow-xl hover:shadow-[#003867]/10 hover:-translate-y-1 transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={b.image} alt={`My Clinic ${b.name}`} fill sizes="360px" className="object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="bg-white text-[#003867] px-3 py-1 rounded-full text-xs font-bold">
                      {isRtl ? b.cityAr : b.city}
                    </span>
                    {b.label && (
                      <span className="bg-[#003867] text-white px-3 py-1 rounded-full text-xs font-bold">
                        {isRtl ? b.labelAr : b.label}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-extrabold text-[#003867] mb-2">
                    {isRtl ? `${b.nameAr}، ${b.cityAr}` : `${b.name}, ${b.city}`}
                  </h3>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2 text-slate-600">
                      <span className="material-symbols-outlined text-[#003867] text-base mt-0.5">schedule</span>
                      <div className="text-xs space-y-1">
                        {b.isDental ? (
                          <>
                            <p className="font-bold text-[#003867] text-[11px]">{isRtl ? "عيادة الأسنان" : "Dental Clinic"}</p>
                            <p className="font-medium">{isRtl ? "السبت – الخميس: 10:00 ص – 10:00 م" : "Sat – Thu: 10:00 AM – 10:00 PM"}</p>
                            <p className="font-medium">{isRtl ? "الجمعة: 4:00 م – 8:00 م" : "Fri: 4:00 PM – 8:00 PM"}</p>
                          </>
                        ) : b.isTahlia ? (
                          <>
                            <p className="font-medium">{isRtl ? "السبت – الخميس: 1:00 م – 9:00 م" : "Sat – Thu: 1:00 PM – 9:00 PM"}</p>
                            <p className="font-bold text-red-600">{isRtl ? "مغلق يوم الجمعة" : "Closed on Friday"}</p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium">{isRtl ? "الأحد – الخميس: 9:00 ص – 9:00 م" : "Sun – Thu: 9:00 AM – 9:00 PM"}</p>
                            {b.isRiyadh ? (
                              <p className="font-bold text-red-600">{isRtl ? "مغلق يوم الجمعة" : "Closed on Friday"}</p>
                            ) : (
                              <p className="font-medium">{isRtl ? "الجمعة: 5:00 م – 9:00 م" : "Fri: 5:00 PM – 9:00 PM"}</p>
                            )}
                            <p className="font-medium">{isRtl ? "السبت: 1:00 م – 9:00 م" : "Sat: 1:00 PM – 9:00 PM"}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="material-symbols-outlined text-[#003867] text-base">call</span>
                      <span className="text-xs font-bold text-[#003867]" dir="ltr">920 022 811</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="material-symbols-outlined text-[#003867] text-base">location_on</span>
                      <span className="text-xs font-bold text-[#003867]">{isRtl ? "عرض على الخريطة" : "View on map"}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="flex md:hidden justify-center gap-4 mt-5">
            <button onClick={() => scroll("prev")} className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-[#003867] active:bg-[#003867] active:text-white transition-all border border-[#003867]/10" aria-label="Previous">
              <span className="material-symbols-outlined text-lg">{isRtl ? "chevron_right" : "chevron_left"}</span>
            </button>
            <button onClick={() => scroll("next")} className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-[#003867] active:bg-[#003867] active:text-white transition-all border border-[#003867]/10" aria-label="Next">
              <span className="material-symbols-outlined text-lg">{isRtl ? "chevron_left" : "chevron_right"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
