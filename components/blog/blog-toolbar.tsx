"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  slug: string;
  name: string;
}

interface BlogToolbarProps {
  categories: Category[];
  currentQ?: string;
  currentCategory?: string;
}

export function BlogToolbar({ categories, currentQ = "", currentCategory = "" }: BlogToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      // Reset to page 1 when filters change
      params.delete("page");
      return params.toString();
    },
    [searchParams],
  );

  function handleSearch(value: string) {
    startTransition(() => {
      const qs = createQueryString({ q: value || null });
      router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    });
  }

  function handleCategory(slug: string) {
    startTransition(() => {
      const newCat = slug === currentCategory ? null : slug;
      const qs = createQueryString({ category: newCat });
      router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    });
  }

  function handleClear() {
    startTransition(() => {
      router.push(pathname);
    });
  }

  const hasFilters = currentQ || currentCategory;

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Search input */}
      <div className="relative max-w-lg">
        <label htmlFor="blog-search" className="sr-only">
          Tìm kiếm bài viết
        </label>
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-navy/40 pointer-events-none"
          aria-hidden="true"
        />
        <input
          id="blog-search"
          type="search"
          defaultValue={currentQ}
          onChange={(e) => {
            const value = e.target.value;
            // Debounce using a simple approach with useTransition
            const timer = setTimeout(() => handleSearch(value), 300);
            return () => clearTimeout(timer);
          }}
          placeholder="Tìm kiếm bài viết…"
          className={cn(
            "w-full rounded-lg border border-cream-200 bg-white py-2.5 pl-10 pr-4 text-sm text-navy",
            "placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent",
            "min-h-[44px] transition-colors",
            isPending && "opacity-70",
          )}
          autoComplete="off"
          aria-label="Tìm kiếm bài viết"
        />
      </div>

      {/* Category filter chips + clear */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-wrap">
        <button
          onClick={() => handleCategory("")}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors border min-h-[36px]",
            !currentCategory
              ? "bg-navy text-cream border-navy"
              : "bg-white text-navy/70 border-cream-200 hover:border-navy/30 hover:text-navy",
          )}
          aria-pressed={!currentCategory}
        >
          Tất cả
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategory(cat.slug)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors border min-h-[36px]",
              currentCategory === cat.slug
                ? "bg-navy text-cream border-navy"
                : "bg-white text-navy/70 border-cream-200 hover:border-navy/30 hover:text-navy",
            )}
            aria-pressed={currentCategory === cat.slug}
          >
            {cat.name}
          </button>
        ))}

        {hasFilters && (
          <button
            onClick={handleClear}
            className="shrink-0 flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-navy/50 hover:text-navy border border-transparent hover:border-cream-200 transition-colors min-h-[36px] ml-2"
            aria-label="Xóa bộ lọc"
          >
            <X className="size-3.5" aria-hidden="true" />
            Xóa bộ lọc
          </button>
        )}
      </div>
    </div>
  );
}
