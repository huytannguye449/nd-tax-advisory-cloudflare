"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Tag } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import {
  PublicationCard,
  publicationFromPost,
} from "@/components/content/publication-card";
import { BlogClient } from "@/components/blog/blog-client";
import type { Category, PostWithMeta } from "@/lib/supabase/types";

interface PublicationsResponse {
  ok: boolean;
  error?: string;
  categories?: Category[];
  posts?: PostWithMeta[];
}

export function PublicationsLive() {
  const [posts, setPosts] = useState<PostWithMeta[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/public/posts", { cache: "no-store" });
        const json = (await res.json()) as PublicationsResponse;
        if (cancelled) return;
        if (!res.ok || !json.ok) {
          setError(json.error || "Không tải được ấn phẩm");
          return;
        }
        setPosts(json.posts ?? []);
        setCategories(json.categories ?? []);
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
  }, []);

  if (loading) return <PublicationsSkeleton />;

  if (error || posts.length === 0) {
    return (
      <Section bg="cream-100" spacing="md" hairlineTop>
        <Container size="narrow">
          <PublicationMessage text={error || "Chưa có ấn phẩm published."} />
        </Container>
      </Section>
    );
  }

  const featuredPost = posts.find((post) => post.is_featured) ?? posts[0];
  const otherPosts = posts.filter((post) => post.id !== featuredPost.id);
  const popular = posts.slice(0, 3);

  return (
    <>
      <Section bg="cream" spacing="sm" className="py-10 md:py-12">
        <Container size="xl">
          <p className="mb-5 text-label-caps text-navy/60">Ấn phẩm mới nhất</p>
          <PublicationCard
            publication={publicationFromPost(featuredPost)}
            variant="featured"
          />
        </Container>
      </Section>

      <Section
        bg="cream-100"
        spacing="md"
        hairlineTop
        className="py-14 md:py-16"
      >
        <Container size="xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-[var(--spacing-gutter)]">
            <div className="lg:col-span-8">
              {otherPosts.length > 0 ? (
                <BlogClient posts={otherPosts} categories={categories} />
              ) : (
                <PublicationMessage text="Chưa có thêm ấn phẩm nào." />
              )}
            </div>

            <EditorialSidebar posts={popular} categories={categories} />
          </div>
        </Container>
      </Section>
    </>
  );
}

function EditorialSidebar({
  posts,
  categories,
}: {
  posts: PostWithMeta[];
  categories: Category[];
}) {
  return (
    <aside className="lg:col-span-4" aria-label="Sidebar ấn phẩm">
      <div className="space-y-6 lg:sticky lg:top-32">
        <SubscribeBox />

        {posts.length > 0 && (
          <SidebarSection title="Bài viết được quan tâm">
            <ol className="space-y-4">
              {posts.map((post, idx) => (
                <li key={post.id} className="grid grid-cols-[2.5rem_1fr] gap-3">
                  <span
                    className="select-none font-heading text-2xl font-bold leading-none text-cream-300"
                    aria-hidden="true"
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <Link
                      href={`/an-pham/${post.slug}`}
                      className="line-clamp-2 text-body-sm font-semibold leading-snug text-navy transition-colors hover:text-gold-700"
                    >
                      {post.title}
                    </Link>
                    {post.reading_time ? (
                      <p className="mt-1 text-label-caps text-navy/40">
                        {post.reading_time} phút đọc
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </SidebarSection>
        )}

        {categories.length > 0 && (
          <SidebarSection
            title={
              <span className="inline-flex items-center gap-2">
                <Tag className="size-4" aria-hidden="true" />
                Chủ đề phổ biến
              </span>
            }
          >
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/an-pham?category=${cat.slug}`}
                  className="border border-data-row px-3 py-2 text-label-caps text-navy/70 transition-colors hover:border-gold hover:text-gold-700"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </SidebarSection>
        )}
      </div>
    </aside>
  );
}

function SidebarSection({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-data-row pt-5">
      <h2 className="mb-4 text-label-caps text-navy/60">{title}</h2>
      {children}
    </section>
  );
}

function PublicationsSkeleton() {
  return (
    <>
      <Section bg="cream" spacing="sm">
        <Container size="xl">
          <div className="mb-8 h-4 w-40 animate-pulse bg-cream-200" />
          <div className="h-[340px] animate-pulse bg-cream-200 md:h-[400px]" />
        </Container>
      </Section>
      <Section bg="cream-100" spacing="md" hairlineTop>
        <Container size="xl">
          <div className="grid gap-[var(--spacing-gutter)] lg:grid-cols-12">
            <div className="grid gap-[var(--spacing-gutter)] md:grid-cols-2 lg:col-span-8">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="border border-data-row bg-cream p-5">
                  <div className="aspect-[16/10] animate-pulse bg-cream-200" />
                  <div className="mt-5 h-4 w-24 animate-pulse bg-cream-200" />
                  <div className="mt-5 h-8 w-full animate-pulse bg-cream-200" />
                  <div className="mt-3 h-4 w-2/3 animate-pulse bg-cream-200" />
                </div>
              ))}
            </div>
            <div className="hidden lg:col-span-4 lg:block">
              <div className="h-56 animate-pulse bg-navy/15" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function PublicationMessage({ text }: { text: string }) {
  return (
    <div className="border-y border-data-row py-16 text-center">
      <p className="text-body-lg text-navy/55">{text}</p>
    </div>
  );
}

function SubscribeBox() {
  return (
    <section
      className="bg-navy p-5 text-cream md:p-6"
      aria-labelledby="subscribe-title"
    >
      <h2
        id="subscribe-title"
        className="font-heading text-headline-sm text-cream"
      >
        Đăng ký nhận bản tin
      </h2>
      <p className="mt-2 text-body-sm leading-relaxed text-cream/70">
        Nhận những phân tích và cập nhật chính sách mới nhất trực tiếp vào hộp
        thư của bạn.
      </p>
      <form
        action="/api/subscribe"
        method="post"
        className="mt-5 flex flex-col gap-3"
      >
        <label>
          <span className="sr-only">Email của bạn</span>
          <input
            type="email"
            name="email"
            required
            placeholder="email@congty.vn"
            autoComplete="email"
            className="min-h-[44px] w-full border-0 border-b border-cream/30 bg-transparent py-2.5 text-body-sm text-cream placeholder:text-cream/45 focus:border-gold focus:outline-none"
          />
        </label>
        <input type="hidden" name="source" value="publications-sidebar" />
        <button
          type="submit"
          className="min-h-[44px] w-full bg-gold px-4 py-2.5 text-label-caps text-navy transition-colors hover:bg-gold-600"
        >
          Đăng ký ngay
        </button>
      </form>
    </section>
  );
}
