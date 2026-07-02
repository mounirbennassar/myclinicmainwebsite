import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostArticle from "@/app/components/content/PostArticle";
import { getPublishedPost } from "@/app/lib/content";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post || post.type !== "news") return { title: "My Clinic | عيادتي" };
  return {
    title: `${post.title_ar || post.title_en} | My Clinic`,
    description: post.excerpt_ar || post.excerpt_en || undefined,
    openGraph: post.cover_image_url ? { images: [{ url: post.cover_image_url }] } : undefined,
  };
}

export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post || post.type !== "news") notFound();
  return <PostArticle post={post} type="news" />;
}
