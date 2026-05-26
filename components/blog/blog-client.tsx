"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  PublicationCard,
  publicationFromPost,
} from "@/components/content/publication-card";
import type { Category, PostWithMeta } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 4;

export function BlogClient({
  posts,
  categories,
}: {
  posts: PostWithMeta[];
  categories: Category[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setActiveCategory(params.get("category") ?? "");
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (activeCategory && post.category?.slug !== activeCategory)
        return false;
      if (q) {
        const haystack = `${post.title} ${post.excerpt ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [posts, query, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedPosts = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function setCategory(slug: string) {
    setActiveCategory(slug);
    setPage(1);
  }

  function setSearch(value: string) {
    setQuery(value);
    setPage(1);
  }

  return (
    <div>
      <div className="mb-8 border-y border-data-row py-3">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div
            className="flex flex-wrap gap-x-4 gap-y-2"
            aria-label="Lọc ấn phẩm theo chủ đề"
          >
            <FilterButton
              active={!activeCategory}
              onClick={() => setCategory("")}
            >
              Tất cả
            </FilterButton>
            {categories.map((cat) => (
              <FilterButton
                key={cat.id}
                active={activeCategory === cat.slug}
                onClick={() => setCategory(cat.slug)}
              >
                {cat.name}
              </FilterButton>
            ))}
          </div>

          <label className="relative block min-w-0 xl:w-64">
            <span className="sr-only">Tìm kiếm ấn phẩm</span>
            <Search
              className="absolute right-0 top-1/2 size-4 -translate-y-1/2 text-navy/45"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="min-h-[44px] w-full border-0 border-b border-data-row bg-transparent py-2 pr-8 text-body-sm text-navy placeholder:text-navy/45 focus:border-gold focus:outline-none"
            />
          </label>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="border-y border-data-row py-12 text-center text-body-md text-navy/55">
          Không tìm thấy ấn phẩm phù hợp.
        </p>
      ) : (
        <>
          <p className="mb-5 text-label-caps text-navy/50">
            {filtered.length} ấn phẩm
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {pagedPosts.map((post) => (
              <PublicationCard
                key={post.id}
                publication={publicationFromPost(post)}
                variant="default"
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              page={safePage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-[34px] border-b text-label-caps transition-colors",
        active
          ? "border-gold text-gold-700"
          : "border-transparent text-navy/60 hover:border-navy/30 hover:text-navy",
      )}
    >
      {children}
    </button>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1);
  return (
    <nav
      aria-label="Phân trang ấn phẩm"
      className="mt-12 flex items-center justify-center gap-2"
    >
      <PageButton
        ariaLabel="Trang trước"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </PageButton>
      {pages.map((item) => (
        <PageButton
          key={item}
          active={item === page}
          ariaLabel={`Trang ${item}`}
          onClick={() => onPageChange(item)}
        >
          {item}
        </PageButton>
      ))}
      <PageButton
        ariaLabel="Trang sau"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </PageButton>
    </nav>
  );
}

function PageButton({
  active,
  disabled,
  ariaLabel,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  ariaLabel: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-10 items-center justify-center border text-body-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        active
          ? "border-gold bg-gold text-navy"
          : "border-data-row bg-cream text-navy hover:border-gold",
      )}
    >
      {children}
    </button>
  );
}
