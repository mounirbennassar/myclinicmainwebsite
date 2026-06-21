"use client";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/app/i18n/context";
import { dentalServiceCatalog } from "../content/services";

export default function DentalServicesGrid({ excludeSlug }: { excludeSlug?: string }) {
  const { lang } = useLang();
  const isRtl = lang === "ar";
  const items = dentalServiceCatalog.filter((s) => s.slug !== excludeSlug);

  return (
    <section className="py-16 md:py-28 bg-gradient-to-b from-white via-white to-[#003867]/[0.03]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#003867]/10 text-[#003867] text-[11px] font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#003867]" />
            {isRtl ? "تخصصاتنا" : "Our Services"}
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            {isRtl ? "علاجات الأسنان التي نقدمها" : "Dental treatments we offer"}
          </h2>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-base">
            {isRtl
              ? "نخبة من العلاجات التخصصية بأعلى المعايير وأحدث التقنيات."
              : "A complete range of specialty treatments delivered with the highest standards and latest technology."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {items.map((s) => (
            <Link
              key={s.slug}
              href={`/dental/${s.slug}`}
              className="group relative bg-white rounded-3xl overflow-hidden border border-[#003867]/10 hover:border-[#003867]/30 hover:shadow-2xl hover:shadow-[#003867]/15 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image / gradient header */}
              <div className={`relative aspect-[5/4] overflow-hidden ${s.image ? "" : `bg-gradient-to-br ${s.gradient}`}`}>
                {s.image ? (
                  <Image
                    src={s.image}
                    alt={isRtl ? s.ar : s.en}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <>
                    {/* Decorative SVG dots pattern */}
                    <svg className="absolute inset-0 w-full h-full opacity-[0.12]" viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden>
                      <defs>
                        <pattern id={`dots-${s.slug}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                          <circle cx="2" cy="2" r="1.5" fill="white" />
                        </pattern>
                      </defs>
                      <rect width="200" height="200" fill={`url(#dots-${s.slug})`} />
                    </svg>

                    {/* Soft glow blob */}
                    <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-colors" />
                    <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-white/5 blur-xl" />

                    {/* Centered icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/15 rounded-full blur-xl scale-150" />
                        <span
                          className="relative material-symbols-outlined text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                          style={{ fontSize: 88, fontVariationSettings: "'FILL' 1, 'wght' 300" }}
                        >
                          {s.icon}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Bottom gradient fade for legibility when using a real photo */}
                {s.image && (
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
                )}

                {/* Floating chip — service number / label */}
                <div className="absolute top-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-bold text-[#003867] shadow-sm"
                     style={isRtl ? { right: 16 } : { left: 16 }}>
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  {isRtl ? "تخصصي" : "Specialty"}
                </div>
              </div>

              {/* Card body */}
              <div className="p-5 md:p-6">
                <h3 className="font-extrabold text-slate-900 text-lg leading-tight tracking-tight">
                  {isRtl ? s.ar : s.en}
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">
                  {isRtl ? s.blurb.ar : s.blurb.en}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#003867]">
                    {isRtl ? "اعرف المزيد" : "Learn more"}
                    <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                      {isRtl ? "arrow_back" : "arrow_forward"}
                    </span>
                  </span>
                  <div className="w-9 h-9 rounded-full bg-[#003867]/5 group-hover:bg-[#003867] flex items-center justify-center transition-colors duration-300">
                    <span className="material-symbols-outlined text-[18px] text-[#003867] group-hover:text-white transition-colors">
                      {isRtl ? "chevron_left" : "chevron_right"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
