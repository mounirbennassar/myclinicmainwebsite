import type { Metadata } from "next";
import PostsIndex from "@/app/components/content/PostsIndex";
import { getPublishedPosts } from "@/app/lib/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "المدونة الصحية | My Clinic Health Blog",
  description:
    "نصائح وإرشادات صحية من أطباء عيادتي. Health tips, guides and insights from My Clinic's doctors and specialists.",
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts("blog");
  return <PostsIndex type="blog" posts={posts} />;
}
