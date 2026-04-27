import type { Metadata } from "next";
import Link from "next/link";
import { createStaticClient as createClient } from "@/lib/supabase/static";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { ArticleCard } from "@/components/blog/article-card";
import type { PostWithMeta, Category } from "@/lib/supabase/types";
import { BookOpen, Tag } from "lucide-react";
import { BlogClient } from "@/components/blog/blog-client";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Kiến thức",
  description:
    "Bài viết, hướng dẫn, và insights về thuế cho founder và CFO Việt Nam.",
};

export default async function KienThucPage() {
  const supabase = createClient();

  const [{ data: categoriesData }, { data: postsData }] = await Promise.all([
    supabase.from("categories").select("*").order("display_order"),
    supabase
      .from("posts")
      .select(
        "id, slug, title, excerpt, cover_url, reading_time, published_at, status, body_mdx, body_html, seo_title, seo_description, og_image_url, view_count, is_featured, created_at, updated_at, author_id, category_id, scheduled_at, category:categories(name, slug), author:authors(name, slug, avatar_url, title)",
      )
      .eq("status", "published")
      .order("published_at", { ascending: false }),
  ]);

  const categories = (categoriesData ?? []) as Category[];
  const allPosts = (postsData ?? []) as unknown as PostWithMeta[];
  const featuredPost = allPosts.find((p) => p.is_featured) ?? null;
  const otherPosts = allPosts.filter((p) => p.id !== featuredPost?.id);
  const popular = allPosts.slice(0, 5);

  return (
    <>
      <Section bg="cream" spacing="md">
        <Container size="xl">
          <div className="flex flex-col items-center gap-4 text-center max-w-2xl mx-auto">
            <Eyebrow>KIẾN THỨC</Eyebrow>
            <h1 className="text-4xl font-bold text-navy md:text-5xl lg:text-6xl text-balance">
              Insights thuế cho founder Việt
            </h1>
            <p className="text-base leading-relaxed text-navy/65 md:text-lg max-w-xl">
              Bài viết chuyên sâu về chiến lược thuế, cập nhật chính sách, và case
              study thực tế từ đội ngũ N&amp;D Tax Advisory.
            </p>
          </div>
        </Container>
      </Section>

      {featuredPost && (
        <Section bg="cream" spacing="sm">
          <Container size="xl">
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-navy/60">
              Bài viết nổi bật
            </h2>
            <ArticleCard post={featuredPost} variant="featured" />
          </Container>
        </Section>
      )}

      <Section bg="cream-100" spacing="md">
        <Container size="xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              {otherPosts.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-20 text-center">
                  <BookOpen className="size-12 text-navy/20" aria-hidden="true" />
                  <p className="text-lg font-medium text-navy/50">Chưa có bài viết nào.</p>
                </div>
              ) : (
                <BlogClient posts={otherPosts} categories={categories} />
              )}
            </div>

            <aside className="lg:col-span-4" aria-label="Sidebar">
              <div className="space-y-6 lg:sticky lg:top-36">
                <div className="rounded-2xl border border-navy/10 bg-navy p-5 text-cream">
                  <h3 className="mb-2 text-base font-bold">Nhận insights hàng tuần</h3>
                  <p className="mb-4 text-sm text-cream/60">
                    Mỗi tuần một bài thuế chiến lược. Miễn phí.
                  </p>
                  <form
                    action="/api/subscribe"
                    method="post"
                    className="flex flex-col gap-3"
                  >
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="email@congty.vn"
                      autoComplete="email"
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
                    />
                    <input type="hidden" name="source" value="blog-sidebar" />
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-navy hover:bg-gold-600 transition-colors min-h-[44px]"
                    >
                      Đăng ký
                    </button>
                  </form>
                </div>

                {popular.length > 0 && (
                  <div className="rounded-2xl border border-cream-200 bg-white p-5">
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-navy/60">
                      Đọc nhiều nhất
                    </h3>
                    <ol className="space-y-4">
                      {popular.map((post, idx) => (
                        <li key={post.id} className="flex gap-3">
                          <span
                            className="mt-0.5 shrink-0 text-2xl font-bold leading-none text-cream-300 select-none"
                            aria-hidden="true"
                          >
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <Link
                              href={`/kien-thuc/${post.slug}`}
                              className="text-sm font-semibold text-navy leading-snug hover:text-gold-700 transition-colors line-clamp-2"
                            >
                              {post.title}
                            </Link>
                            {post.reading_time && (
                              <p className="mt-1 text-xs text-navy/40">
                                {post.reading_time} phút đọc
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {categories.length > 0 && (
                  <div className="rounded-2xl border border-cream-200 bg-white p-5">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-navy/60">
                      <Tag className="size-4" aria-hidden="true" />
                      Chủ đề
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <span
                          key={cat.id}
                          className="rounded-full px-3 py-1 text-xs font-medium border bg-cream text-navy/70 border-cream-200"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
