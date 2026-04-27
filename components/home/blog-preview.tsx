import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { createClient } from "@/lib/supabase/server";
import type { PostWithMeta } from "@/lib/supabase/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

async function getRecentPosts(): Promise<PostWithMeta[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select(
        "id, slug, title, excerpt, cover_url, reading_time, published_at, status, body_mdx, body_html, seo_title, seo_description, og_image_url, view_count, is_featured, created_at, updated_at, author_id, category_id, scheduled_at, category:categories(name, slug), author:authors(name, slug, avatar_url, title)",
      )
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3);

    if (error || !data) return [];

    return data as unknown as PostWithMeta[];
  } catch {
    return [];
  }
}

function PostSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-cream-200 bg-white overflow-hidden">
      <div className="aspect-video w-full bg-cream-200 animate-pulse" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-5 w-24 rounded bg-cream-200 animate-pulse" />
        <div className="h-6 w-full rounded bg-cream-200 animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-cream-200 animate-pulse" />
        <p className="text-sm text-navy/40 mt-2">Bài viết sắp xuất bản</p>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: PostWithMeta }) {
  return (
    <article className="group flex flex-col rounded-xl border border-cream-200 bg-white overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gold/40">
      {/* Cover image */}
      <Link
        href={`/kien-thuc/${post.slug}`}
        className="relative block aspect-video w-full overflow-hidden bg-cream-200"
        tabIndex={-1}
        aria-hidden="true"
      >
        {post.cover_url ? (
          <Image
            src={post.cover_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-cream-200">
            <span className="font-heading text-2xl font-bold text-navy/20">N&amp;D</span>
          </div>
        )}
      </Link>

      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Category badge */}
        {post.category && (
          <span className="inline-block w-fit rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-700">
            {post.category.name}
          </span>
        )}

        {/* Title */}
        <h3 className="text-base font-bold leading-snug text-navy line-clamp-2 md:text-lg">
          <Link href={`/kien-thuc/${post.slug}`} className="hover:text-gold-700 transition-colors">
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm leading-relaxed text-navy/60 line-clamp-2 flex-1">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-navy/45 mt-auto pt-2 border-t border-cream-200">
          {post.author && <span>{post.author.name}</span>}
          {post.author && post.published_at && (
            <span aria-hidden="true">&middot;</span>
          )}
          {post.published_at && (
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          )}
          {post.reading_time && (
            <>
              <span aria-hidden="true">&middot;</span>
              <span>{post.reading_time} phút đọc</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export async function BlogPreview() {
  const posts = await getRecentPosts();
  const isEmpty = posts.length === 0;

  return (
    <Section bg="cream" spacing="md">
      <Container size="xl">
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <Eyebrow color="gold">Kiến thức</Eyebrow>
          <h2 className="text-3xl font-bold text-navy md:text-4xl">Bài viết mới</h2>
          <p className="text-base text-navy/60 max-w-xl">
            Insights thuế chiến lược, cập nhật chính sách, và case study thực tế từ đội ngũ N&amp;D.
          </p>
        </div>

        <div className={cn("grid gap-6", "grid-cols-1 md:grid-cols-3")}>
          {isEmpty
            ? Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
            : posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>

        <div className="mt-10 flex justify-center">
          <Button variant="outline" size="md" asChild>
            <Link href="/kien-thuc">Xem tất cả bài viết</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
