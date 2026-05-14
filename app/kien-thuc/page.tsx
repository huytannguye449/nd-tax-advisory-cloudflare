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
      {/* Hero — editorial broadsheet, asymmetric */}
      <Section bg="cream" spacing="md">
        <Container size="xl">
          <div className="flex flex-col gap-4 max-w-2xl">
            <Eyebrow color="gold">KIẾN THỨC</Eyebrow>
            <h1 className="font-heading text-headline-lg text-navy text-balance">
              Insights thuế cho founder Việt
            </h1>
            <p className="text-body-lg text-navy/65 leading-relaxed max-w-xl">
              Bài viết chuyên sâu về chiến lược thuế, cập nhật chính sách, và case
              study thực tế từ đội ngũ NHN&amp;D Tax Advisory.
            </p>
          </div>
        </Container>
      </Section>

      {featuredPost && (
        <Section bg="cream" spacing="sm">
          <Container size="xl">
            <p className="mb-6 text-label-caps text-navy/60">
              Bài viết nổi bật
            </p>
            <ArticleCard post={featuredPost} variant="featured" />
          </Container>
        </Section>
      )}

      <Section bg="cream-100" spacing="md" hairlineTop>
        <Container size="xl">
          <div className="grid grid-cols-1 gap-[var(--spacing-gutter)] lg:grid-cols-12">
            <div className="lg:col-span-8">
              {otherPosts.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-20 text-center">
                  <BookOpen className="size-12 text-navy/20" aria-hidden="true" />
                  <p className="text-body-lg text-navy/50">Chưa có bài viết nào.</p>
                </div>
              ) : (
                <BlogClient posts={otherPosts} categories={categories} />
              )}
            </div>

            <aside className="lg:col-span-4" aria-label="Sidebar">
              <div className="space-y-6 lg:sticky lg:top-36">
                {/* Newsletter sidebar — navy block, sharp */}
                <div className="bg-navy p-5 text-cream">
                  <h3 className="font-heading text-headline-sm text-cream mb-2">Nhận insights hàng tuần</h3>
                  <p className="mb-4 text-body-sm text-cream/60">
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
                      className="w-full border-b border-cream/30 bg-transparent px-0 py-2.5 text-body-sm text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold min-h-[44px]"
                    />
                    <input type="hidden" name="source" value="blog-sidebar" />
                    <button
                      type="submit"
                      className="w-full bg-gold px-4 py-2.5 text-body-sm font-semibold text-navy hover:bg-gold-600 transition-colors min-h-[44px]"
                    >
                      Đăng ký
                    </button>
                  </form>
                </div>

                {popular.length > 0 && (
                  <div className="border-t-hairline border-gold pt-5">
                    <h3 className="mb-4 text-label-caps text-navy/60">
                      Đọc nhiều nhất
                    </h3>
                    <ol className="space-y-4">
                      {popular.map((post, idx) => (
                        <li key={post.id} className="flex gap-3">
                          <span
                            className="mt-0.5 shrink-0 text-2xl font-bold leading-none text-cream-300 select-none font-heading"
                            aria-hidden="true"
                          >
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <Link
                              href={`/kien-thuc/${post.slug}`}
                              className="text-body-sm font-semibold text-navy leading-snug hover:text-gold-700 transition-colors line-clamp-2"
                            >
                              {post.title}
                            </Link>
                            {post.reading_time && (
                              <p className="mt-1 text-label-caps text-navy/40">
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
                  <div className="border-t-hairline border-gold pt-5">
                    <h3 className="mb-4 flex items-center gap-2 text-label-caps text-navy/60">
                      <Tag className="size-4" aria-hidden="true" />
                      Chủ đề
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <span
                          key={cat.id}
                          className="px-3 py-1 text-label-caps border border-cream-200 bg-cream text-navy/70"
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
