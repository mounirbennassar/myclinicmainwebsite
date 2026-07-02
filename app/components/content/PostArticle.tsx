"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLang } from "@/app/i18n/context";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import type { PostType, PublicPost } from "@/app/lib/content";

const BACK_LABEL: Record<PostType, { en: string; ar: string }> = {
  blog: { en: "All blog posts", ar: "كل المقالات" },
  news: { en: "All news", ar: "كل الأخبار" },
};

// Styled markdown building blocks (no typography plugin in this project).
const mdComponents = {
  h1: (props: React.ComponentProps<"h1">) => <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-10 mb-4" {...props} />,
  h2: (props: React.ComponentProps<"h2">) => <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-8 mb-3" {...props} />,
  h3: (props: React.ComponentProps<"h3">) => <h3 className="text-lg md:text-xl font-bold text-slate-800 mt-6 mb-2" {...props} />,
  p: (props: React.ComponentProps<"p">) => <p className="text-slate-600 leading-relaxed mb-4" {...props} />,
  ul: (props: React.ComponentProps<"ul">) => <ul className="list-disc ps-6 mb-4 space-y-1.5 text-slate-600" {...props} />,
  ol: (props: React.ComponentProps<"ol">) => <ol className="list-decimal ps-6 mb-4 space-y-1.5 text-slate-600" {...props} />,
  a: (props: React.ComponentProps<"a">) => <a className="text-[#004d99] font-semibold hover:underline" {...props} />,
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote className="border-s-4 border-[#004d99]/30 ps-4 italic text-slate-500 my-5" {...props} />
  ),
  strong: (props: React.ComponentProps<"strong">) => <strong className="font-bold text-slate-800" {...props} />,
  img: (props: React.ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="rounded-xl my-6 w-full" alt="" loading="lazy" {...props} />
  ),
  table: (props: React.ComponentProps<"table">) => (
    <div className="overflow-x-auto my-5">
      <table className="w-full text-sm border-collapse [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:px-3 [&_th]:py-2 [&_td]:border [&_td]:border-slate-200 [&_td]:px-3 [&_td]:py-2 text-slate-600" {...props} />
    </div>
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code className="bg-slate-100 text-[#004d99] rounded px-1.5 py-0.5 text-[0.9em]" {...props} />
  ),
  hr: () => <hr className="border-slate-200 my-8" />,
};

export default function PostArticle({ post, type }: { post: PublicPost; type: PostType }) {
  const { lang } = useLang();
  const isAr = lang === "ar";

  const title = isAr ? post.title_ar || post.title_en : post.title_en;
  const body = isAr ? post.body_ar || post.body_en : post.body_en || post.body_ar;
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString(isAr ? "ar-SA" : "en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: isAr ? "var(--font-tajawal), sans-serif" : "var(--font-manrope), sans-serif" }}>
      <SiteNav />
      <main className="max-w-3xl mx-auto px-5 md:px-8 pt-28 md:pt-36 pb-16 md:pb-24">
        <Link href={`/${type}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#004d99] hover:underline mb-6">
          <svg className={`w-4 h-4 ${isAr ? "" : "rotate-180"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
          {BACK_LABEL[type][lang]}
        </Link>

        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">{title}</h1>
        <p className="text-sm text-slate-400 font-medium mb-8">
          {dateStr}
          {post.author_name ? ` · ${post.author_name}` : ""}
        </p>

        {post.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover_image_url} alt={title} className="w-full rounded-2xl mb-8 bg-slate-100" />
        )}

        {body ? (
          <article dir={isAr && post.body_ar ? "rtl" : "ltr"}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {body}
            </ReactMarkdown>
          </article>
        ) : (
          <p className="text-slate-400">{isAr ? "المحتوى غير متوفر." : "No content available."}</p>
        )}

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-slate-100">
            {post.tags.map((t) => (
              <span key={t} className="bg-slate-100 text-slate-500 text-xs font-semibold px-2.5 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
