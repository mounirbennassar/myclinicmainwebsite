"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../layout";

type PostType = "blog" | "news";
type PostStatus = "draft" | "published" | "archived";

type Post = {
  id: string;
  type: PostType;
  slug: string;
  title_en: string;
  title_ar: string | null;
  excerpt_en: string | null;
  excerpt_ar: string | null;
  body_en: string | null;
  body_ar: string | null;
  cover_image_url: string | null;
  tags: string[];
  status: PostStatus;
  published_at: string | null;
  author_name: string | null;
  created_at: string;
  updated_at: string | null;
};

type SitePage = {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string | null;
  body_en: string | null;
  body_ar: string | null;
  meta_description: string | null;
  status: "draft" | "published";
  updated_by: string | null;
  created_at: string;
  updated_at: string | null;
};

type Tab = "blog" | "news" | "pages";

const STATUS_BADGE: Record<string, string> = {
  draft: "bg-slate-100 text-slate-500",
  published: "bg-emerald-50 text-emerald-600",
  archived: "bg-amber-50 text-amber-600",
};

const inputCls =
  "w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#004d99]/20 focus:border-[#004d99] transition-all placeholder:text-slate-300";
const labelCls = "text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5";

export default function ContentPage() {
  const user = useUser();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("blog");
  const [posts, setPosts] = useState<Post[]>([]);
  const [pages, setPages] = useState<SitePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Post | SitePage | null>(null);

  const allowed = user?.role === "super_admin" || user?.role === "admin" || user?.role === "content_manager";

  useEffect(() => {
    if (user && !allowed) router.push("/dashboard");
  }, [user, allowed, router]);

  // No synchronous setLoading(true) here: `loading` starts true for the first
  // load, and refetches after save/delete swap the list in place spinner-free.
  const fetchAll = useCallback(async () => {
    try {
      const [p, g] = await Promise.all([
        fetch("/api/content/posts").then((r) => (r.ok ? r.json() : { data: [] })),
        fetch("/api/content/pages").then((r) => (r.ok ? r.json() : { data: [] })),
      ]);
      setPosts(p.data || []);
      setPages(g.data || []);
    } catch {
      /* silent */
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (!user || !allowed) return null;

  const list: (Post | SitePage)[] =
    tab === "pages" ? pages : posts.filter((p) => p.type === tab);
  const filtered = list.filter(
    (item) =>
      !search ||
      item.title_en.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditing(null);
    setEditorOpen(true);
  };
  const openEdit = (item: Post | SitePage) => {
    setEditing(item);
    setEditorOpen(true);
  };

  const remove = async (item: Post | SitePage) => {
    if (!confirm(`Delete "${item.title_en}"? This cannot be undone.`)) return;
    const path = tab === "pages" ? `/api/content/pages/${item.id}` : `/api/content/posts/${item.id}`;
    await fetch(path, { method: "DELETE" });
    fetchAll();
  };

  const tabs: { value: Tab; label: string; count: number }[] = [
    { value: "blog", label: "Blog", count: posts.filter((p) => p.type === "blog").length },
    { value: "news", label: "News", count: posts.filter((p) => p.type === "news").length },
    { value: "pages", label: "Pages", count: pages.length },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold text-slate-900">Content</h1>
        <button
          onClick={openCreate}
          className="bg-[#004d99] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#003d7a] transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {tab === "pages" ? "New Page" : tab === "news" ? "New Article" : "New Post"}
        </button>
      </div>

      {/* Tabs + search */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 md:p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-sm font-semibold w-fit">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-4 py-1.5 rounded-md transition-colors ${
                tab === t.value ? "bg-white text-[#004d99] shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
              <span className="ml-1.5 text-[10px] text-slate-400">{t.count}</span>
            </button>
          ))}
        </div>
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputCls} pl-9`}
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-[#004d99] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-sm font-medium">
              {tab === "pages" ? "No pages yet" : `No ${tab} content yet`} — create the first one.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <div key={item.id} className="px-5 py-4 flex items-center gap-4">
                {"cover_image_url" in item && item.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.cover_image_url} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800 text-sm truncate">{item.title_en}</p>
                    <span className={`${STATUS_BADGE[item.status]} text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    /{tab === "pages" ? "" : `${(item as Post).type}/`}{item.slug}
                    {"author_name" in item && item.author_name ? ` · ${item.author_name}` : ""}
                    {" · "}
                    {new Date(item.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Edit">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                    </svg>
                  </button>
                  <button onClick={() => remove(item)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editorOpen && tab !== "pages" && (
        <PostEditor
          post={editing as Post | null}
          defaultType={tab}
          onClose={() => setEditorOpen(false)}
          onSaved={() => {
            setEditorOpen(false);
            fetchAll();
          }}
        />
      )}
      {editorOpen && tab === "pages" && (
        <PageEditor
          page={editing as SitePage | null}
          onClose={() => setEditorOpen(false)}
          onSaved={() => {
            setEditorOpen(false);
            fetchAll();
          }}
        />
      )}
    </main>
  );
}

// ── Shared cover-image upload control ────────────────────────────────────────
function CoverUpload({ url, onChange }: { url: string; onChange: (u: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/content/upload", { method: "POST", body: form });
      const data = await res.json();
      if (res.ok && data.url) onChange(data.url);
      else setError(data.error || "Upload failed");
    } catch {
      setError("Upload failed");
    }
    setUploading(false);
  };

  return (
    <div>
      <label className={labelCls}>Cover Image</label>
      <div className="flex items-center gap-3">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="w-16 h-16 rounded-lg object-cover bg-slate-100 border border-slate-200" />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-slate-50 border border-dashed border-slate-200" />
        )}
        <div className="flex-1 space-y-2">
          <input
            type="url"
            value={url}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL, or upload →"
            className={inputCls}
          />
          <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#004d99] cursor-pointer hover:underline">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            {uploading ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
            />
          </label>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}

// ── Post editor (blog + news) ────────────────────────────────────────────────
function PostEditor({
  post,
  defaultType,
  onClose,
  onSaved,
}: {
  post: Post | null;
  defaultType: PostType;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [type, setType] = useState<PostType>(post?.type ?? defaultType);
  const [titleEn, setTitleEn] = useState(post?.title_en ?? "");
  const [titleAr, setTitleAr] = useState(post?.title_ar ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerptEn, setExcerptEn] = useState(post?.excerpt_en ?? "");
  const [excerptAr, setExcerptAr] = useState(post?.excerpt_ar ?? "");
  const [bodyEn, setBodyEn] = useState(post?.body_en ?? "");
  const [bodyAr, setBodyAr] = useState(post?.body_ar ?? "");
  const [cover, setCover] = useState(post?.cover_image_url ?? "");
  const [tags, setTags] = useState((post?.tags ?? []).join(", "));
  const [status, setStatus] = useState<PostStatus>(post?.status ?? "draft");
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      type,
      title_en: titleEn,
      title_ar: titleAr || null,
      slug: slug || undefined,
      excerpt_en: excerptEn || null,
      excerpt_ar: excerptAr || null,
      body_en: bodyEn || null,
      body_ar: bodyAr || null,
      cover_image_url: cover || null,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      status,
    };
    try {
      const res = await fetch(post ? `/api/content/posts/${post.id}` : "/api/content/posts", {
        method: post ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) onSaved();
      else setError(data.error || "Failed to save");
    } catch {
      setError("Network error");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold text-slate-900">
            {post ? "Edit" : "New"} {type === "news" ? "News Article" : "Blog Post"}
          </h3>
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-semibold">
            {(["en", "ar"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  lang === l ? "bg-white text-[#004d99] shadow-sm" : "text-slate-500"
                }`}
              >
                {l === "en" ? "English" : "العربية"}
              </button>
            ))}
          </div>
        </div>
        <form onSubmit={save} className="px-6 py-5 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg font-medium border border-red-100">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as PostType)} className={inputCls}>
                <option value="blog">Blog</option>
                <option value="news">News</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as PostStatus)} className={inputCls}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {lang === "en" ? (
            <>
              <div>
                <label className={labelCls}>Title (English)</label>
                <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Excerpt (English)</label>
                <textarea value={excerptEn} onChange={(e) => setExcerptEn(e.target.value)} rows={2} className={inputCls} placeholder="Short summary shown on listing cards" />
              </div>
              <div>
                <label className={labelCls}>Body (English, Markdown)</label>
                <textarea value={bodyEn} onChange={(e) => setBodyEn(e.target.value)} rows={10} className={`${inputCls} font-mono text-[13px]`} placeholder={"# Heading\n\nWrite the article in markdown..."} />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className={labelCls}>Title (Arabic)</label>
                <input dir="rtl" type="text" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Excerpt (Arabic)</label>
                <textarea dir="rtl" value={excerptAr} onChange={(e) => setExcerptAr(e.target.value)} rows={2} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Body (Arabic, Markdown)</label>
                <textarea dir="rtl" value={bodyAr} onChange={(e) => setBodyAr(e.target.value)} rows={10} className={`${inputCls} font-mono text-[13px]`} />
              </div>
            </>
          )}

          <div>
            <label className={labelCls}>Slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className={inputCls} placeholder="auto-generated from title if empty" />
          </div>

          <CoverUpload url={cover} onChange={setCover} />

          <div>
            <label className={labelCls}>Tags</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className={inputCls} placeholder="health, dental, tips (comma-separated)" />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-[#004d99] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#003d7a] transition-all disabled:opacity-50">
              {saving ? "Saving..." : status === "published" ? "Save & Publish" : "Save Draft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Page editor ──────────────────────────────────────────────────────────────
function PageEditor({
  page,
  onClose,
  onSaved,
}: {
  page: SitePage | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [titleEn, setTitleEn] = useState(page?.title_en ?? "");
  const [titleAr, setTitleAr] = useState(page?.title_ar ?? "");
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [bodyEn, setBodyEn] = useState(page?.body_en ?? "");
  const [bodyAr, setBodyAr] = useState(page?.body_ar ?? "");
  const [metaDescription, setMetaDescription] = useState(page?.meta_description ?? "");
  const [status, setStatus] = useState<"draft" | "published">(page?.status ?? "draft");
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      title_en: titleEn,
      title_ar: titleAr || null,
      slug: slug || undefined,
      body_en: bodyEn || null,
      body_ar: bodyAr || null,
      meta_description: metaDescription || null,
      status,
    };
    try {
      const res = await fetch(page ? `/api/content/pages/${page.id}` : "/api/content/pages", {
        method: page ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) onSaved();
      else setError(data.error || "Failed to save");
    } catch {
      setError("Network error");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold text-slate-900">{page ? "Edit Page" : "New Page"}</h3>
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-semibold">
            {(["en", "ar"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  lang === l ? "bg-white text-[#004d99] shadow-sm" : "text-slate-500"
                }`}
              >
                {l === "en" ? "English" : "العربية"}
              </button>
            ))}
          </div>
        </div>
        <form onSubmit={save} className="px-6 py-5 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg font-medium border border-red-100">{error}</div>}

          <div>
            <label className={labelCls}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")} className={inputCls}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {lang === "en" ? (
            <>
              <div>
                <label className={labelCls}>Title (English)</label>
                <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Body (English, Markdown)</label>
                <textarea value={bodyEn} onChange={(e) => setBodyEn(e.target.value)} rows={12} className={`${inputCls} font-mono text-[13px]`} />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className={labelCls}>Title (Arabic)</label>
                <input dir="rtl" type="text" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Body (Arabic, Markdown)</label>
                <textarea dir="rtl" value={bodyAr} onChange={(e) => setBodyAr(e.target.value)} rows={12} className={`${inputCls} font-mono text-[13px]`} />
              </div>
            </>
          )}

          <div>
            <label className={labelCls}>Slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className={inputCls} placeholder="auto-generated from title if empty" />
          </div>
          <div>
            <label className={labelCls}>Meta Description</label>
            <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} className={inputCls} placeholder="SEO description (150–160 characters)" />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-[#004d99] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#003d7a] transition-all disabled:opacity-50">
              {saving ? "Saving..." : status === "published" ? "Save & Publish" : "Save Draft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
