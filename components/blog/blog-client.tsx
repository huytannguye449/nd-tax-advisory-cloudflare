"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ArticleCard } from "@/components/blog/article-card";
import type { PostWithMeta, Category } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

export function BlogClient({
  posts,
  categories,
}: {
  posts: PostWithMeta[];
  categories: Category[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (activeCategory && p.category?.slug !== activeCategory) return false;
      if (q) {
        const haystack = `${p.title} ${p.excerpt ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [posts, query, activeCategory]);

  return (
    <div>
      {/* Filter toolbar — hairline top, sharp */}
      <div className="mb-6 flex flex-col gap-3 border-t-hairline border-gold pt-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-navy/40"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm bài viết…"
            className="w-full border border-cream-300 bg-white pl-10 pr-4 py-2.5 text-body-sm text-navy placeholder:text-navy/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold min-h-[44px]"
            aria-label="Tìm bài viết"
          />
        </div>

        {/* Category filter — label-caps, sharp */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("")}
            className={cn(
              "px-3 py-1.5 text-label-caps border transition min-h-[36px]",
              !activeCategory
                ? "bg-navy text-cream border-navy"
                : "bg-white text-navy/70 border-cream-300 hover:border-navy/30",
            )}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.slug)}
              className={cn(
                "px-3 py-1.5 text-label-caps border transition min-h-[36px]",
                activeCategory === cat.slug
                  ? "bg-navy text-cream border-navy"
                  : "bg-white text-navy/70 border-cream-300 hover:border-navy/30",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-body-md text-navy/50">
          Không tìm thấy bài viết phù hợp. Thử từ khoá khác.
        </p>
      ) : (
        <>
          <p className="mb-6 text-label-caps text-navy/50">{filtered.length} bài viết</p>
          <div className="grid grid-cols-1 gap-[var(--spacing-gutter)] sm:grid-cols-2">
            {filtered.map((post) => (
              <ArticleCard key={post.id} post={post} variant="default" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
