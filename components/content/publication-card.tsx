import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { PostWithMeta } from "@/lib/supabase/types";
import {
  ContentMeta,
  publicationMetaItems,
} from "@/components/shared/content-meta";

export interface PublicationCardData {
  title: string;
  href: string;
  excerpt?: string | null;
  coverUrl?: string | null;
  category?: {
    name: string;
    slug?: string | null;
    href?: string;
  } | null;
  publishedAt?: string | null;
  author?: {
    name: string;
    avatarUrl?: string | null;
  } | null;
  readingTime?: number | null;
  featured?: boolean;
}

interface PublicationCardProps {
  publication: PublicationCardData;
  variant?: "default" | "featured" | "compact";
  className?: string;
}

export function publicationFromPost(post: PostWithMeta): PublicationCardData {
  const author = post.person ?? post.author;
  return {
    title: post.title,
    href: `/an-pham/${post.slug}`,
    excerpt: post.excerpt,
    coverUrl: post.cover_url,
    category: post.category
      ? {
          name: post.category.name,
          slug: post.category.slug,
          href: `/an-pham?category=${post.category.slug}`,
        }
      : null,
    publishedAt: post.published_at,
    author: author
      ? {
          name: author.name,
          avatarUrl: author.avatar_url,
        }
      : null,
    readingTime: post.reading_time,
    featured: post.is_featured,
  };
}

export function PublicationCard({
  publication,
  variant = "default",
  className,
}: PublicationCardProps) {
  if (variant === "featured") {
    return (
      <article
        className={cn(
          "group relative isolate min-h-[340px] overflow-hidden bg-navy text-cream md:min-h-[400px]",
          className,
        )}
      >
        <PublicationImage
          publication={publication}
          priority
          className="absolute inset-0 aspect-auto h-full"
          imageClassName="opacity-40"
        />
        <div className="absolute inset-0 bg-navy/50" aria-hidden="true" />
        <div className="relative z-10 flex min-h-[340px] max-w-4xl flex-col justify-end p-6 md:min-h-[400px] md:p-9 lg:p-12">
          <PublicationCategory publication={publication} tone="cream" />
          <h2 className="mt-3 max-w-3xl font-heading text-headline-lg leading-[1.08] text-cream text-balance">
            <Link
              href={publication.href}
              className="transition-colors hover:text-gold"
            >
              {publication.title}
            </Link>
          </h2>
          {publication.excerpt && (
            <p className="mt-4 max-w-2xl text-body-md leading-relaxed text-cream/78">
              {publication.excerpt}
            </p>
          )}
          <ContentMeta
            tone="cream"
            items={publicationMetaItems({
              category: null,
              publishedAt: publication.publishedAt,
              author: publication.author?.name,
              authorAvatarUrl: publication.author?.avatarUrl,
              readingTime: publication.readingTime,
            })}
            className="mt-5 border-t border-cream/20 pt-3 text-cream/65"
          />
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className={cn("group border-t border-data-row pt-5", className)}>
        <PublicationCategory publication={publication} />
        <h3 className="mt-3 font-heading text-headline-sm leading-snug text-navy">
          <Link
            href={publication.href}
            className="transition-colors hover:text-gold-700"
          >
            {publication.title}
          </Link>
        </h3>
        <ContentMeta
          items={publicationMetaItems({
            category: null,
            publishedAt: publication.publishedAt,
            author: publication.author?.name,
            readingTime: publication.readingTime,
          })}
          className="mt-3"
        />
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group flex h-full flex-col border border-data-row bg-cream transition-colors hover:border-gold",
        className,
      )}
    >
      <PublicationImage publication={publication} className="aspect-[16/10]" />
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <PublicationCategory publication={publication} />
        <h3 className="mt-3 line-clamp-2 flex-1 font-heading text-headline-sm leading-snug text-navy">
          <Link
            href={publication.href}
            className="transition-colors hover:text-gold-700"
          >
            {publication.title}
          </Link>
        </h3>
        {publication.excerpt && (
          <p className="mt-3 line-clamp-3 text-body-sm leading-relaxed text-navy/62">
            {publication.excerpt}
          </p>
        )}
        <ContentMeta
          items={publicationMetaItems({
            category: null,
            publishedAt: publication.publishedAt,
            author: publication.author?.name,
            authorAvatarUrl: publication.author?.avatarUrl,
            readingTime: publication.readingTime,
          })}
          className="mt-4 border-t border-data-row pt-3 text-navy/45"
        />
      </div>
    </article>
  );
}

function PublicationImage({
  publication,
  priority,
  className,
  imageClassName,
}: {
  publication: PublicationCardData;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <Link
      href={publication.href}
      className={cn(
        "relative block aspect-video w-full overflow-hidden bg-cream-200",
        className,
      )}
      tabIndex={-1}
      aria-hidden="true"
    >
      {publication.coverUrl ? (
        <Image
          src={publication.coverUrl}
          alt={publication.title}
          fill
          priority={priority}
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-[1.03]",
            imageClassName,
          )}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-cream-200">
          <span className="font-heading text-3xl font-bold text-navy/20">
            NHN&amp;D
          </span>
        </div>
      )}
      {publication.featured && (
        <span className="absolute left-4 top-4 bg-gold px-3 py-1 text-label-caps text-navy">
          Nổi bật
        </span>
      )}
    </Link>
  );
}

function PublicationCategory({
  publication,
  tone = "navy",
}: {
  publication: PublicationCardData;
  tone?: "navy" | "cream";
}) {
  if (!publication.category?.name) return null;
  const label = (
    <span
      className={cn(
        "text-label-caps transition-colors",
        tone === "cream" ? "text-gold" : "text-gold-700",
      )}
    >
      {publication.category.name}
    </span>
  );

  if (!publication.category.href) return label;

  return (
    <Link
      href={publication.category.href}
      className={cn(
        "inline-flex",
        tone === "cream" ? "hover:text-cream" : "hover:text-gold",
      )}
    >
      {label}
    </Link>
  );
}
