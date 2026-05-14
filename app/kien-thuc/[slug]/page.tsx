import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { ChevronRight, Calendar, Clock, User } from "lucide-react";
import { createStaticClient as createClient } from "@/lib/supabase/static";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Button } from "@/components/shared/button";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { ShareButtons } from "@/components/blog/share-buttons";
import { InlineSubscribe } from "@/components/blog/inline-subscribe";
import { AuthorBio } from "@/components/blog/author-bio";
import { RelatedArticles } from "@/components/blog/related-articles";
import { mdxComponents } from "@/components/blog/mdx-components";
import { formatDate, SITE } from "@/lib/utils";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const supabase = createClient();
  const { data } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published")
    .returns<{ slug: string }[]>();
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, cover_url, seo_title, seo_description, published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (!post) return { title: "Không tìm thấy bài viết" };
  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      publishedTime: post.published_at || undefined,
      images: post.cover_url ? [{ url: post.cover_url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_url ? [post.cover_url] : [],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createClient();

  type PostDetail = {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    cover_url: string | null;
    body_mdx: string;
    reading_time: number | null;
    published_at: string | null;
    category_id: string | null;
    category: { id: string; name: string; slug: string } | null;
    author: { name: string; slug: string; title: string | null; bio: string | null; avatar_url: string | null } | null;
  };

  const { data: postRaw } = await supabase
    .from("posts")
    .select(
      `id, slug, title, excerpt, cover_url, body_mdx, reading_time, published_at, category_id,
       category:categories(id, name, slug),
       author:authors(name, slug, title, bio, avatar_url)`,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!postRaw) notFound();
  const post = postRaw as unknown as PostDetail;

  // Related articles (same category)
  const { data: relatedRaw } = post.category_id
    ? await supabase
        .from("posts")
        .select(
          `id, slug, title, excerpt, cover_url, reading_time, published_at, is_featured,
           category:categories(name, slug),
           author:authors(name, slug, avatar_url)`,
        )
        .eq("status", "published")
        .eq("category_id", post.category_id)
        .neq("id", post.id)
        .order("published_at", { ascending: false })
        .limit(3)
    : { data: null };
  const related = relatedRaw as unknown as import("@/lib/supabase/types").PostWithMeta[] | null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.cover_url,
    datePublished: post.published_at,
    author: {
      "@type": "Person",
      name: post.author?.name ?? SITE.founder,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}/logo/logo-primary.png` },
    },
  };

  const url = `${SITE.url}/kien-thuc/${post.slug}`;

  return (
    <>
      <ReadingProgress />

      <article className="bg-cream">
        {/* Breadcrumb */}
        <Container size="lg" className="pt-6 md:pt-8">
          <nav aria-label="Breadcrumb" className="text-body-sm text-navy/60 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-gold-700 transition-colors">Trang chủ</Link>
            <ChevronRight className="size-3.5" aria-hidden />
            <Link href="/kien-thuc" className="hover:text-gold-700 transition-colors">Kiến thức</Link>
            {post.category && (
              <>
                <ChevronRight className="size-3.5" aria-hidden />
                <Link href={`/kien-thuc?category=${post.category.slug}`} className="hover:text-gold-700 transition-colors">
                  {post.category.name}
                </Link>
              </>
            )}
          </nav>
        </Container>

        {/* Article header — container-narrow for readability */}
        <Container size="narrow" className="pt-6 md:pt-10 pb-8">
          {post.category && (
            <Eyebrow color="gold" className="mb-4">{post.category.name}</Eyebrow>
          )}
          <h1 className="font-heading text-headline-lg text-navy leading-tight text-balance">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-5 text-body-lg text-navy/75 leading-relaxed text-pretty">
              {post.excerpt}
            </p>
          )}

          {/* Meta — hairline border-y */}
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-body-sm text-navy/60 border-y border-data-row py-4">
            {post.author && (
              <span className="flex items-center gap-2">
                {post.author.avatar_url ? (
                  <Image
                    src={post.author.avatar_url}
                    alt={post.author.name}
                    width={36}
                    height={36}
                    className="object-cover border border-cream-300"
                  />
                ) : (
                  <span className="size-9 bg-navy/10 flex items-center justify-center">
                    <User className="size-4" aria-hidden />
                  </span>
                )}
                <span className="font-medium text-navy">{post.author.name}</span>
              </span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" aria-hidden />
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              </span>
            )}
            {post.reading_time && (
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden />
                <span>{post.reading_time} phút đọc</span>
              </span>
            )}
            <span className="ml-auto">
              <ShareButtons url={url} title={post.title} />
            </span>
          </div>
        </Container>

        {/* Cover image — no rounded */}
        {post.cover_url && (
          <Container size="lg" className="pb-8">
            <div className="relative aspect-[16/9] md:aspect-[16/8] overflow-hidden">
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

        {/* Body — container-narrow (65ch), token prose via mdx-components */}
        <Container size="narrow" className="pb-16">
          <div className="max-w-none">
            <MDXRemote
              source={post.body_mdx}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: "wrap" }],
                  ],
                },
              }}
            />
          </div>

          {/* Inline subscribe — navy callout block */}
          <div className="mt-12 mb-12">
            <InlineSubscribe />
          </div>

          {/* Author bio — flat, hairline top */}
          {post.author && (
            <div className="mt-12">
              <AuthorBio author={post.author} />
            </div>
          )}

          {/* CTA block — navy, sharp, no rounded */}
          <div className="mt-12 bg-navy text-cream p-8 md:p-10 text-center">
            <Eyebrow color="cream" className="mb-4">Tư vấn cá nhân</Eyebrow>
            <h2 className="font-heading text-headline-md text-cream">Cần tư vấn cho doanh nghiệp của bạn?</h2>
            <p className="mt-3 text-body-md text-cream/80 max-w-xl mx-auto">
              Buổi tư vấn đầu tiên 45 phút hoàn toàn miễn phí. Đặt lịch ngay hôm nay.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="secondary" size="lg">
                <Link href="/dat-lich">Đặt lịch tư vấn</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="!border-cream !text-cream hover:!bg-cream hover:!text-navy">
                <Link href="/lien-he">Liên hệ</Link>
              </Button>
            </div>
          </div>
        </Container>
      </article>

      {/* Related articles */}
      {related && related.length > 0 && (
        <Section bg="cream-100" spacing="md" hairlineTop>
          <Container size="lg">
            <Eyebrow color="gold" className="mb-3">BÀI VIẾT LIÊN QUAN</Eyebrow>
            <h2 className="font-heading text-headline-md text-navy mb-8">Cùng chủ đề</h2>
            <RelatedArticles posts={related} />
          </Container>
        </Section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </>
  );
}
