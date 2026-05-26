import { PublicationCard, publicationFromPost } from "@/components/content/publication-card";
import type { PostWithMeta } from "@/lib/supabase/types";

interface ArticleCardProps {
  post: PostWithMeta;
  variant?: "default" | "featured";
  className?: string;
}

export function ArticleCard({ post, variant = "default", className }: ArticleCardProps) {
  return (
    <PublicationCard
      publication={publicationFromPost(post)}
      variant={variant}
      className={className}
    />
  );
}
