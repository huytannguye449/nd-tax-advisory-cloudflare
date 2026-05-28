"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronRight, Clock, User } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Button } from "@/components/shared/button";
import { ShareButtons } from "@/components/blog/share-buttons";
import { InlineSubscribe } from "@/components/blog/inline-subscribe";
import { AuthorBio } from "@/components/blog/author-bio";
import { RelatedArticles } from "@/components/blog/related-articles";
import { formatDate, SITE } from "@/lib/utils";
import type { PostWithMeta } from "@/lib/supabase/types";

interface PostDetail {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  body_mdx: string;
  body_html: string | null;
  reading_time: number | null;
  published_at: string | null;
  category_id: string | null;
  category: { id: string; name: string; slug: string } | null;
  person: {
    name: string;
    slug: string;
    title: string | null;
    bio: string | null;
    avatar_url: string | null;
  } | null;
  author: {
    name: string;
    slug: string;
    title: string | null;
    bio: string | null;
    avatar_url: string | null;
  } | null;
}

interface PostResponse {
  ok: boolean;
  error?: string;
  post?: PostDetail;
  related?: PostWithMeta[];
}

export function PublicationDetailLive({
  initialSlug,
}: {
  initialSlug?: string;
}) {
  const slug = useMemo(
    () => initialSlug || getSlugFromLocation(),
    [initialSlug],
  );
  const [post, setPost] = useState<PostDetail | null>(null);
  const [related, setRelated] = useState<PostWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) {
      setError("Không tìm thấy ấn phẩm");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          `/api/public/post?slug=${encodeURIComponent(slug)}`,
          {
            cache: "no-store",
          },
        );
        const json = (await res.json()) as PostResponse;
        if (cancelled) return;
        if (!res.ok || !json.ok || !json.post) {
          setError(json.error || "Không tìm thấy ấn phẩm");
          return;
        }
        setPost(json.post);
        setRelated(json.related ?? []);
        document.title = `${json.post.title} · ${SITE.name}`;
      } catch {
        if (!cancelled) setError("Không tải được ấn phẩm");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) return <ArticleLoading />;
  if (error || !post)
    return <ArticleNotFound message={error || "Không tìm thấy ấn phẩm"} />;

  const url = `${SITE.url}/an-pham/${post.slug}`;
  const author = post.person ?? post.author;

  return (
    <>
      <article className="bg-cream">
        <Container size="lg" className="pt-6 md:pt-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-body-sm text-navy/60"
          >
            <Link href="/" className="transition-colors hover:text-gold-700">
              Trang chủ
            </Link>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <Link
              href="/an-pham"
              className="transition-colors hover:text-gold-700"
            >
              Ấn phẩm
            </Link>
            {post.category && (
              <>
                <ChevronRight className="size-3.5" aria-hidden="true" />
                <Link
                  href={`/an-pham?category=${post.category.slug}`}
                  className="transition-colors hover:text-gold-700"
                >
                  {post.category.name}
                </Link>
              </>
            )}
          </nav>
        </Container>

        <Container size="narrow" className="pb-8 pt-6 md:pt-10">
          {post.category && (
            <Eyebrow color="gold" className="mb-4">
              {post.category.name}
            </Eyebrow>
          )}
          <h1 className="font-heading text-headline-lg leading-tight text-navy text-balance">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-5 text-body-lg leading-relaxed text-navy/75 text-pretty">
              {post.excerpt}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-data-row py-4 text-body-sm text-navy/60">
            {author && (
              <span className="flex items-center gap-2">
                {author.avatar_url ? (
                  <Image
                    src={author.avatar_url}
                    alt={author.name}
                    width={36}
                    height={36}
                    className="border border-cream-300 object-cover"
                  />
                ) : (
                  <span className="flex size-9 items-center justify-center bg-navy/10">
                    <User className="size-4" aria-hidden="true" />
                  </span>
                )}
                <span className="font-medium text-navy">{author.name}</span>
              </span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" aria-hidden="true" />
                <time dateTime={post.published_at}>
                  {formatDate(post.published_at)}
                </time>
              </span>
            )}
            {post.reading_time && (
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden="true" />
                <span>{post.reading_time} phút đọc</span>
              </span>
            )}
            <span className="ml-auto">
              <ShareButtons url={url} title={post.title} />
            </span>
          </div>
        </Container>

        {post.cover_url && (
          <Container size="lg" className="pb-8">
            <div className="relative aspect-[16/9] overflow-hidden md:aspect-[16/8]">
              <Image
                src={post.cover_url}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          </Container>
        )}

        <Container size="narrow" className="pb-16">
          <LiveArticleBody html={post.body_html || post.body_mdx} />

          <div className="mb-12 mt-12">
            <InlineSubscribe />
          </div>

          {author && (
            <div className="mt-12">
              <AuthorBio author={author} />
            </div>
          )}

          <div className="mt-12 bg-navy p-8 text-center text-cream md:p-10">
            <Eyebrow color="cream" className="mb-4">
              Tư vấn cá nhân
            </Eyebrow>
            <h2 className="font-heading text-headline-md text-cream">
              Cần tư vấn cho doanh nghiệp của bạn?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-body-md text-cream/80">
              Buổi tư vấn đầu tiên 45 phút hoàn toàn miễn phí. Đặt lịch ngay hôm
              nay.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/dat-lich"
                className="inline-flex h-14 min-h-[44px] items-center justify-center border border-cream bg-transparent px-9 text-[15px] font-semibold uppercase tracking-[0.08em] text-cream transition-colors duration-150 hover:border-gold hover:bg-gold hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                Đặt lịch tư vấn
              </Link>
              <Link
                href="/lien-he"
                className="inline-flex h-14 min-h-[44px] items-center justify-center border border-cream bg-transparent px-9 text-[15px] font-semibold uppercase tracking-[0.08em] text-cream transition-colors duration-150 hover:border-gold hover:bg-gold hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                Liên hệ
              </Link>
            </div>
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <Section bg="cream-100" spacing="md" hairlineTop>
          <Container size="lg">
            <Eyebrow color="gold" className="mb-3">
              ẤN PHẨM LIÊN QUAN
            </Eyebrow>
            <h2 className="mb-8 font-heading text-headline-md text-navy">
              Cùng chủ đề
            </h2>
            <RelatedArticles posts={related} />
          </Container>
        </Section>
      )}
    </>
  );
}

function getSlugFromLocation() {
  if (typeof window === "undefined") return "";
  const searchSlug = new URLSearchParams(window.location.search).get("slug");
  if (searchSlug) return searchSlug;
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[0] === "an-pham" ? (parts[1] ?? "") : "";
}

function LiveArticleBody({ html }: { html: string }) {
  const rendered = useMemo(() => renderBody(html), [html]);
  return (
    <div
      className="live-article-content max-w-none"
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}

function renderBody(input: string) {
  const trimmed = input.trim();
  if (trimmed.startsWith("<")) return trimmed;
  return trimmed
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function ArticleLoading() {
  return (
    <article className="bg-cream">
      <Container size="narrow" className="py-16">
        <div className="h-4 w-24 animate-pulse bg-cream-200" />
        <div className="mt-6 h-14 w-full animate-pulse bg-cream-200" />
        <div className="mt-4 h-5 w-3/4 animate-pulse bg-cream-200" />
        <div className="mt-10 aspect-video animate-pulse bg-cream-200" />
      </Container>
    </article>
  );
}

function ArticleNotFound({ message }: { message: string }) {
  return (
    <Section bg="cream" spacing="lg">
      <Container size="narrow">
        <div className="border-t-hairline border-gold pt-10 text-center">
          <Eyebrow color="gold" className="mb-4">
            ẤN PHẨM
          </Eyebrow>
          <h1 className="font-heading text-headline-md text-navy">
            Không tìm thấy ấn phẩm
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-body-md text-navy/60">
            {message}
          </p>
          <div className="mt-8">
            <Button asChild variant="primary" size="md">
              <Link href="/an-pham">Quay lại ấn phẩm</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
