// Server-side helpers for CMS content. Public pages fetch the FastAPI backend
// directly (not through the browser rewrite) so articles are in the SSR HTML
// for SEO. Failures degrade to empty lists so `next build` never depends on a
// running backend.

const BACKEND = process.env.BACKEND_ORIGIN || "http://127.0.0.1:8020";
const REVALIDATE_SECONDS = 300;

export type PostType = "blog" | "news";

export type PublicPostCard = {
  id: string;
  type: PostType;
  slug: string;
  title_en: string;
  title_ar: string | null;
  excerpt_en: string | null;
  excerpt_ar: string | null;
  cover_image_url: string | null;
  tags: string[];
  published_at: string | null;
  author_name: string | null;
};

export type PublicPost = PublicPostCard & {
  body_en: string | null;
  body_ar: string | null;
};

export async function getPublishedPosts(type: PostType): Promise<PublicPostCard[]> {
  try {
    const res = await fetch(`${BACKEND}/api/content/public/posts?type=${type}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts ?? [];
  } catch {
    return [];
  }
}

export async function getPublishedPost(slug: string): Promise<PublicPost | null> {
  try {
    const res = await fetch(`${BACKEND}/api/content/public/posts/${encodeURIComponent(slug)}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.post ?? null;
  } catch {
    return null;
  }
}
