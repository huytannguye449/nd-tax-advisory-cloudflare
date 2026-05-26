import Link from "next/link";
import { PublicationCard, publicationFromPost } from "@/components/content/publication-card";
import type { PostWithMeta } from "@/lib/supabase/types";

interface RelatedArticlesProps {
  posts: PostWithMeta[];
}

export function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-heading">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 id="related-heading" className="font-heading text-headline-md text-navy">
          Ấn phẩm liên quan
        </h2>
        <Link
          href="/an-pham"
          className="shrink-0 text-body-sm font-medium text-gold-700 transition-colors hover:text-gold"
        >
          Xem tất cả &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-[var(--spacing-gutter)] sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PublicationCard
            key={post.id}
            publication={publicationFromPost(post)}
            variant="default"
          />
        ))}
      </div>
    </section>
  );
}
