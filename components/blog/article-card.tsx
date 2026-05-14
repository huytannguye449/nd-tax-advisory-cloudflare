import Link from "next/link";
import Image from "next/image";
import { Clock, User } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { PostWithMeta } from "@/lib/supabase/types";

interface ArticleCardProps {
  post: PostWithMeta;
  variant?: "default" | "featured";
  className?: string;
}

export function ArticleCard({ post, variant = "default", className }: ArticleCardProps) {
  if (variant === "featured") {
    return (
      <article
        className={cn(
          "group grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden",
          "border-t-hairline border-gold",
          className,
        )}
      >
        {/* Cover image */}
        <Link
          href={`/kien-thuc/${post.slug}`}
          className="relative block aspect-video lg:aspect-auto lg:min-h-[360px] overflow-hidden bg-cream-200"
          tabIndex={-1}
          aria-hidden="true"
        >
          {post.cover_url ? (
            <Image
              src={post.cover_url}
              alt={post.title}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-cream-200">
              <span className="font-heading text-4xl font-bold text-navy/20">NHN&amp;D</span>
            </div>
          )}
          {post.is_featured && (
            <div className="absolute top-4 left-4">
              <span className="inline-block bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-navy">
                Nổi bật
              </span>
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="flex flex-col gap-4 p-6 md:p-8 justify-center">
          {/* Category eyebrow */}
          {post.category && (
            <Link
              href={`/kien-thuc?category=${post.category.slug}`}
              className="text-label-caps text-gold-700 hover:text-gold transition-colors"
            >
              {post.category.name}
            </Link>
          )}

          {/* Title */}
          <h2 className="font-heading text-headline-md text-navy leading-snug">
            <Link
              href={`/kien-thuc/${post.slug}`}
              className="hover:text-gold-700 transition-colors"
            >
              {post.title}
            </Link>
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-body-md text-navy/65 leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-body-sm text-navy/50 mt-2 pt-4 border-t-hairline border-gold">
            {post.author && (
              <span className="flex items-center gap-1.5">
                {post.author.avatar_url ? (
                  <Image
                    src={post.author.avatar_url}
                    alt={post.author.name}
                    width={24}
                    height={24}
                    className="object-cover"
                  />
                ) : (
                  <User className="size-4" aria-hidden="true" />
                )}
                <span>{post.author.name}</span>
              </span>
            )}
            {post.published_at && (
              <span className="text-label-caps text-navy/50">
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              </span>
            )}
            {post.reading_time && (
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden="true" />
                <span>{post.reading_time} phút đọc</span>
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden border-t-hairline border-gold pt-6",
        className,
      )}
    >
      {/* Cover image — no rounded */}
      {post.cover_url && (
        <Link
          href={`/kien-thuc/${post.slug}`}
          className="relative block aspect-video w-full overflow-hidden bg-cream-200 mb-4"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={post.cover_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>
      )}

      {!post.cover_url && (
        <div className="relative aspect-video w-full bg-cream-200 flex items-center justify-center mb-4">
          <span className="font-heading text-2xl font-bold text-navy/20">NHN&amp;D</span>
        </div>
      )}

      <div className="flex flex-col gap-3 flex-1">
        {/* Category eyebrow */}
        {post.category && (
          <Link
            href={`/kien-thuc?category=${post.category.slug}`}
            className="text-label-caps text-gold-700 hover:text-gold transition-colors"
          >
            {post.category.name}
          </Link>
        )}

        {/* Title */}
        <h3 className="font-heading text-headline-sm text-navy leading-snug line-clamp-2 flex-1">
          <Link
            href={`/kien-thuc/${post.slug}`}
            className="hover:text-gold-700 transition-colors"
          >
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-body-sm text-navy/60 leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        )}

        {/* Meta footer */}
        <div className="flex items-center gap-2 text-body-sm text-navy/45 mt-auto pt-3 border-t border-data-row">
          {post.author && (
            <span className="flex items-center gap-1.5">
              {post.author.avatar_url ? (
                <Image
                  src={post.author.avatar_url}
                  alt={post.author.name}
                  width={20}
                  height={20}
                  className="object-cover"
                />
              ) : (
                <User className="size-3.5" aria-hidden="true" />
              )}
              <span>{post.author.name}</span>
            </span>
          )}
          {post.reading_time && (
            <>
              <span aria-hidden="true">&middot;</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" aria-hidden="true" />
                {post.reading_time} phút
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
