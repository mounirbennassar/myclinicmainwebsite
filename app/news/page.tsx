import type { Metadata } from "next";
import PostsIndex from "@/app/components/content/PostsIndex";
import { getPublishedPosts } from "@/app/lib/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "الأخبار والمستجدات | My Clinic News",
  description:
    "آخر الإعلانات والمستجدات من عيادتي. The latest announcements and updates from My Clinic.",
};

export default async function NewsIndexPage() {
  const posts = await getPublishedPosts("news");
  return <PostsIndex type="news" posts={posts} />;
}
