import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { ArticleCard } from "@/components/blog/article-card";
import { BlogToolbar } from "@/components/blog/blog-toolbar";
import type { PostWithMeta, Category } from "@/lib/supabase/types";
import { BookOpen, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export const runtime = "edge";
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Kiến thức",
  description:
    "Bài viết, hướng dẫn, và insights về thuế cho founder và CFO Việt Nam.",
};

const PAGE_SIZE = 12;

interface SearchParams {
  q?: string;
  category?: string;
  page?: string;
}

interface KienThucPageProps {
  searchParams: Promise<SearchParams>;
}

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("display_order");
    return data ?? [];
  } catch {
    return [];
  }
}

async function getFeaturedPost(): Promise<PostWithMeta | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select(
        "id, slug, title, excerpt, cover_url, reading_time, published_at, status, body_mdx, body_html, seo_title, seo_description, og_image_url, view_count, is_featured, created_at, updated_at, author_id, category_id, scheduled_at, category:categories(name, slug), author:authors(name, slug, avatar_url, title)",
      )
      .eq("status", "published")
      .eq("is_featured", true)
      .order("published_at", { ascending: false })
      .limit(1)
      .single();
    return (data as unknown as PostWithMeta) ?? null;
  } catch {
    return null;
  }
}

async function getPosts(
  q: string,
  categorySlug: string,
  page: number,
  excludeId?: string,
): Promise<{ posts: PostWithMeta[]; total: number }> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("posts")
      .select(
        "id, slug, title, excerpt, cover_url, reading_time, published_at, status, body_mdx, body_html, seo_title, seo_description, og_image_url, view_count, is_featured, created_at, updated_at, author_id, category_id, scheduled_at, category:categories(name, slug), author:authors(name, slug, avatar_url, title)",
        { count: "exact" },
      )
      .eq("status", "published");

    if (excludeId) query = query.neq("id", excludeId);

    if (q) {
      query = query.textSearch("search_vector", q, {
        type: "websearch",
        config: "simple",
      });
    }

    if (categorySlug) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();
      if (cat) query = query.eq("category_id", cat.id);
    }

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, count, error } = await query
      .order("published_at", { ascending: false })
      .range(from, to);

    if (error) return { posts: [], total: 0 };
    return { posts: (data as unknown as PostWithMeta[]) ?? [], total: count ?? 0 };
  } catch {
    return { posts: [], total: 0 };
  }
}

async function getPopularPosts(): Promise<PostWithMeta[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select(
        "id, slug, title, excerpt, cover_url, reading_time, published_at, status, body_mdx, body_html, seo_title, seo_description, og_image_url, view_count, is_featured, created_at, updated_at, author_id, category_id, scheduled_at, category:categories(name, slug), author:authors(name, slug, avatar_url, title)",
      )
      .eq("status", "published")
      .order("view_count", { ascending: false })
      .limit(5);
    return (data as unknown as PostWithMeta[]) ?? [];
  } catch {
    return [];
  }
}

export default async function KienThucPage({ searchParams }: KienThucPageProps) {
  const params = await searchParams;
  const q = params.q ?? "";
  const categorySlug = params.category ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const [categories, featuredPost, popularPosts] = await Promise.all([
    getCategories(),
    getFeaturedPost(),
    getPopularPosts(),
  ]);

  const { posts, total } = await getPosts(q, categorySlug, page, featuredPost?.id);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const isFiltered = !!(q || categorySlug);

  return (
    <>
      {/* ── Hero ── */}
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

      {/* ── Search + Filter Bar (sticky) ── */}
      <div className="sticky top-16 md:top-20 z-30 border-b border-cream-200 bg-cream/95 backdrop-blur-sm">
        <Container size="xl">
          <Suspense fallback={null}>
            <BlogToolbar
              categories={categories}
              currentQ={q}
              currentCategory={categorySlug}
            />
          </Suspense>
        </Container>
      </div>

      {/* ── Featured post (only when no filter active) ── */}
      {!isFiltered && featuredPost && page === 1 && (
        <Section bg="cream" spacing="sm">
          <Container size="xl">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-navy/60 uppercase tracking-widest text-xs">
                Bài viết nổi bật
              </h2>
            </div>
            <ArticleCard post={featuredPost} variant="featured" />
          </Container>
        </Section>
      )}

      {/* ── Main content + Sidebar ── */}
      <Section bg="cream-100" spacing={isFiltered || !featuredPost ? "md" : "sm"}>
        <Container size="xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Main grid */}
            <div className="lg:col-span-8">
              {posts.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-20 text-center">
                  <BookOpen className="size-12 text-navy/20" aria-hidden="true" />
                  <p className="text-lg font-medium text-navy/50">
                    Chưa có bài viết nào
                    {q && (
                      <> cho từ khoá &ldquo;{q}&rdquo;</>
                    )}
                  </p>
                  <p className="text-sm text-navy/40">
                    Thử tìm kiếm với từ khoá khác hoặc xóa bộ lọc.
                  </p>
                </div>
              ) : (
                <>
                  {isFiltered && (
                    <p className="mb-6 text-sm text-navy/50">
                      {total} bài viết
                      {q && <> cho &ldquo;{q}&rdquo;</>}
                      {categorySlug && (
                        <> trong{" "}
                          <span className="font-medium text-navy">
                            {categories.find((c) => c.slug === categorySlug)?.name ?? categorySlug}
                          </span>
                        </>
                      )}
                    </p>
                  )}

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {posts.map((post) => (
                      <ArticleCard key={post.id} post={post} variant="default" />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      q={q}
                      categorySlug={categorySlug}
                    />
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4" aria-label="Sidebar">
              <div className="space-y-6 lg:sticky lg:top-36">
                {/* Subscribe widget */}
                <SidebarSubscribe />

                {/* Popular posts */}
                {popularPosts.length > 0 && (
                  <div className="rounded-2xl border border-cream-200 bg-white p-5">
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-navy/60">
                      Đọc nhiều nhất
                    </h3>
                    <ol className="space-y-4">
                      {popularPosts.map((post, idx) => (
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

                {/* Tag cloud */}
                {categories.length > 0 && (
                  <div className="rounded-2xl border border-cream-200 bg-white p-5">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-navy/60">
                      <Tag className="size-4" aria-hidden="true" />
                      Chủ đề
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/kien-thuc?category=${cat.slug}`}
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium border transition-colors",
                            categorySlug === cat.slug
                              ? "bg-navy text-cream border-navy"
                              : "bg-cream text-navy/70 border-cream-200 hover:border-navy/30",
                          )}
                        >
                          {cat.name}
                        </Link>
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

// ── Sidebar Subscribe (inline client-compatible server component via simple html form) ──
function SidebarSubscribe() {
  return (
    <div className="rounded-2xl border border-navy/10 bg-navy p-5 text-cream">
      <h3 className="mb-2 text-base font-bold">Nhận insights hàng tuần</h3>
      <p className="mb-4 text-sm text-cream/60">
        Mỗi tuần một bài thuế chiến lược. Miễn phí.
      </p>
      <form action="/api/subscribe" method="post" className="flex flex-col gap-3">
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
  );
}

// ── Pagination ──
interface PaginationProps {
  page: number;
  totalPages: number;
  q: string;
  categorySlug: string;
}

function Pagination({ page, totalPages, q, categorySlug }: PaginationProps) {
  function buildHref(p: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categorySlug) params.set("category", categorySlug);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/kien-thuc${qs ? `?${qs}` : ""}`;
  }

  const pages = buildPageRange(page, totalPages);

  return (
    <nav
      aria-label="Phân trang"
      className="mt-12 flex items-center justify-center gap-2"
    >
      {page > 1 && (
        <Link
          href={buildHref(page - 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-cream-200 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-navy/30 hover:shadow-sm transition-all min-h-[40px]"
          aria-label="Trang trước"
        >
          &larr; Trước
        </Link>
      )}

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-navy/40 select-none">
              …
            </span>
          ) : (
            <Link
              key={p}
              href={buildHref(p as number)}
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-lg text-sm font-medium transition-all",
                p === page
                  ? "bg-navy text-cream"
                  : "border border-cream-200 bg-white text-navy hover:border-navy/30",
              )}
              aria-label={`Trang ${p}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </Link>
          ),
        )}
      </div>

      {page < totalPages && (
        <Link
          href={buildHref(page + 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-cream-200 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-navy/30 hover:shadow-sm transition-all min-h-[40px]"
          aria-label="Trang sau"
        >
          Sau &rarr;
        </Link>
      )}
    </nav>
  );
}

function buildPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}
