"use client";

import Link from "next/link";
import { useLang } from "@/app/i18n/context";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import type { PostType, PublicPostCard } from "@/app/lib/content";

const COPY: Record<PostType, { title: { en: string; ar: string }; sub: { en: string; ar: string } }> = {
  blog: {
    title: { en: "Health Blog", ar: "المدونة الصحية" },
    sub: {
      en: "Tips, guides and insights from My Clinic's doctors and specialists.",
      ar: "نصائح وإرشادات ومقالات من أطباء ومختصي عيادتي.",
    },
  },
  news: {
    title: { en: "News & Updates", ar: "الأخبار والمستجدات" },
    sub: {
      en: "The latest announcements and updates from My Clinic.",
      ar: "آخر الإعلانات والمستجدات من عيادتي.",
    },
  },
};

export default function PostsIndex({ type, posts }: { type: PostType; posts: PublicPostCard[] }) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const copy = COPY[type];

  const fmtDate = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString(isAr ? "ar-SA" : "en-GB", { day: "numeric", month: "long", year: "numeric" })
      : "";

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: isAr ? "var(--font-tajawal), sans-serif" : "var(--font-manrope), sans-serif" }}>
      <SiteNav />
      <main className="max-w-6xl mx-auto px-5 md:px-8 pt-28 md:pt-36 pb-16 md:pb-24">
        <header className="mb-10 md:mb-14 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-3">{copy.title[lang]}</h1>
          <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">{copy.sub[lang]}</p>
        </header>

        {posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-slate-400 font-medium">
              {isAr ? "لا توجد مقالات منشورة بعد — عودوا قريبا." : "Nothing published yet — check back soon."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => {
              const title = isAr ? p.title_ar || p.title_en : p.title_en;
              const excerpt = isAr ? p.excerpt_ar || p.excerpt_en : p.excerpt_en;
              return (
                <Link
                  key={p.id}
                  href={`/${type}/${p.slug}`}
                  className="group rounded-2xl border border-slate-200/80 overflow-hidden bg-white hover:shadow-lg hover:border-[#004d99]/30 transition-all"
                >
                  {p.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.cover_image_url}
                      alt={title}
                      loading="lazy"
                      className="w-full aspect-[16/9] object-cover bg-slate-100"
                    />
                  ) : (
                    <div className="w-full aspect-[16/9] bg-gradient-to-br from-[#004d99]/10 to-slate-100 flex items-center justify-center">
                      <span className="text-[#004d99]/40 text-4xl font-black">+</span>
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-[11px] text-slate-400 font-semibold mb-2">
                      {fmtDate(p.published_at)}
                      {p.author_name ? ` · ${p.author_name}` : ""}
                    </p>
                    <h2 className="font-bold text-slate-900 leading-snug mb-2 group-hover:text-[#004d99] transition-colors">
                      {title}
                    </h2>
                    {excerpt && <p className="text-sm text-slate-500 line-clamp-2">{excerpt}</p>}
                    {p.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.tags.slice(0, 3).map((t) => (
                          <span key={t} className="bg-slate-100 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
