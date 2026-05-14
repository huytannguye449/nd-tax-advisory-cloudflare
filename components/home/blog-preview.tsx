import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { createStaticClient as createClient } from "@/lib/supabase/static";
import type { PostWithMeta } from "@/lib/supabase/types";
import { formatDate } from "@/lib/utils";

async function getRecentPosts(): Promise<PostWithMeta[]> {
  try {
    const supabase = createClient();
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
    <div className="flex flex-col gap-5 border-t-hairline border-gold pt-6">
      <div className="h-4 w-24 bg-cream-200 animate-pulse" />
      <div className="h-6 w-full bg-cream-200 animate-pulse" />
      <div className="h-4 w-3/4 bg-cream-200 animate-pulse" />
      <p className="text-body-sm text-navy/40">Bài viết sắp xuất bản</p>
    </div>
  );
}

function PostCard({ post }: { post: PostWithMeta }) {
  return (
    <article className="group flex flex-col gap-5 border-t-hairline border-gold pt-6">
      {/* Cover image — no rounded corners */}
      {post.cover_url && (
        <Link
          href={`/kien-thuc/${post.slug}`}
          className="relative block aspect-video w-full overflow-hidden bg-cream-200"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={post.cover_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </Link>
      )}

      {/* Dateline — label-caps gold */}
      <div className="flex items-center gap-3">
        {post.category && (
          <Eyebrow color="gold">{post.category.name}</Eyebrow>
        )}
        {post.published_at && (
          <time
            dateTime={post.published_at}
            className="text-label-caps text-navy/45 uppercase tracking-[0.1em]"
          >
            {formatDate(post.published_at)}
          </time>
        )}
      </div>

      {/* Title — headline-md Playfair navy */}
      <h3 className="font-heading text-headline-md text-navy leading-snug line-clamp-2">
        <Link href={`/kien-thuc/${post.slug}`} className="hover:text-gold-700 transition-colors">
          {post.title}
        </Link>
      </h3>

      {/* Excerpt — body-sm */}
      {post.excerpt && (
        <p className="text-body-sm text-navy/60 line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>
      )}

      {/* Author meta */}
      {(post.author || post.reading_time) && (
        <div className="flex items-center gap-2 text-label-caps text-navy/45 uppercase tracking-[0.1em] mt-auto">
          {post.author && <span>{post.author.name}</span>}
          {post.author && post.reading_time && (
            <span aria-hidden="true">&middot;</span>
          )}
          {post.reading_time && (
            <span>{post.reading_time} phút đọc</span>
          )}
        </div>
      )}
    </article>
  );
}

export async function BlogPreview() {
  const posts = await getRecentPosts();
  const isEmpty = posts.length === 0;

  return (
    <Section bg="cream" spacing="md" hairlineTop>
      <Container size="default">
        {/* Section header — left-aligned editorial style */}
        <div className="flex flex-col gap-4 mb-16">
          <Eyebrow color="gold">Kiến thức</Eyebrow>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="font-heading text-headline-lg text-navy">Bài viết mới</h2>
            <p className="text-body-md text-navy/60 max-w-md">
              Insights thuế chiến lược, cập nhật chính sách, và case study thực tế từ đội ngũ NHN&amp;D.
            </p>
          </div>
        </div>

        {/* 3-column editorial grid */}
        <div className="grid gap-[var(--spacing-gutter)] grid-cols-1 md:grid-cols-3">
          {isEmpty
            ? Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
            : posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>

        <div className="mt-16 flex justify-start">
          <Button variant="secondary" size="md" asChild>
            <Link href="/kien-thuc">Xem tất cả bài viết</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
