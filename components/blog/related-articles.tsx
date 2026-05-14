import Link from "next/link";
import { ArticleCard } from "@/components/blog/article-card";
import type { PostWithMeta } from "@/lib/supabase/types";

interface RelatedArticlesProps {
  posts: PostWithMeta[];
}

export function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-heading">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h2 id="related-heading" className="font-heading text-headline-md text-navy">
          Bài viết liên quan
        </h2>
        <Link
          href="/kien-thuc"
          className="text-body-sm font-medium text-gold-700 hover:text-gold transition-colors shrink-0"
        >
          Xem tất cả &rarr;
        </Link>
      </div>

      {/* 3-col grid — hairline tops per item, no card bg */}
      <div className="grid grid-cols-1 gap-[var(--spacing-gutter)] sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} variant="default" />
        ))}
      </div>
    </section>
  );
}
