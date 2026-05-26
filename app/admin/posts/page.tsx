"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Star, ExternalLink } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/shared/button";
import { Eyebrow } from "@/components/shared/eyebrow";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  status: "draft" | "scheduled" | "published";
  reading_time: number | null;
  published_at: string | null;
  scheduled_at: string | null;
  is_featured: boolean;
  view_count: number;
  created_at: string;
  category: { name: string; slug: string } | null;
  person: { name: string; slug: string } | null;
  author: { name: string; slug: string } | null;
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  published: "Published",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "border-l-navy/30 text-navy/60",
  scheduled: "border-l-blue-600 text-blue-700",
  published: "border-l-green-600 text-green-700",
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/posts?status=${filter}`, {
      credentials: "include",
    });
    const data = await res.json();
    if (data.ok) setPosts(data.posts);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, [filter]);

  async function remove(id: string) {
    if (!confirm("Xóa bài viết này? Không thể khôi phục.")) return;
    const res = await fetch(`/api/admin/posts?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) void load();
  }

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b-hairline border-gold pb-6">
          <div>
            <Eyebrow color="gold">Content</Eyebrow>
            <h1 className="text-headline-lg font-heading text-navy mt-4">
              Bài viết
            </h1>
            <p className="text-body-md text-navy/65 mt-2">
              {posts.length} bài viết
            </p>
          </div>
          <Button asChild variant="primary" size="sm">
            <Link href="/admin/posts/new">
              <Plus className="size-4" /> Viết bài mới
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-0 border-b-hairline border-gold/30">
          {["all", "draft", "scheduled", "published"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-5 py-3 text-label-caps uppercase transition-colors min-h-[44px] -mb-px border-b-2",
                filter === s
                  ? "text-gold border-gold"
                  : "text-navy/60 hover:text-navy border-transparent",
              )}
            >
              {s === "all" ? "Tất cả" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="border-t-hairline border-gold pt-12 text-center text-body-md text-navy/55">
            Đang tải…
          </div>
        ) : posts.length === 0 ? (
          <div className="border-t-hairline border-gold pt-12 text-center">
            <p className="text-body-md text-navy/55 mb-5">
              Chưa có bài viết nào.
            </p>
            <Button asChild variant="primary" size="sm">
              <Link href="/admin/posts/new">
                <Plus className="size-4" /> Viết bài đầu tiên
              </Link>
            </Button>
          </div>
        ) : (
          <ul>
            {posts.map((p) => (
              <li
                key={p.id}
                className="border-t-hairline border-gold pt-6 pb-6"
              >
                <div className="grid md:grid-cols-12 gap-[var(--spacing-gutter)] items-start">
                  <div className="md:col-span-7 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={cn(
                          "border-l-2 pl-2 text-label-caps uppercase",
                          STATUS_COLORS[p.status],
                        )}
                      >
                        {STATUS_LABELS[p.status]}
                      </span>
                      {p.is_featured && (
                        <span className="border-l-2 border-gold pl-2 text-label-caps uppercase text-gold inline-flex items-center gap-1">
                          <Star className="size-3" /> Featured
                        </span>
                      )}
                      {p.category && (
                        <span className="text-label-caps uppercase text-navy/55">
                          {p.category.name}
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading text-headline-sm text-navy">
                      {p.title}
                    </h3>
                    {p.excerpt && (
                      <p className="text-body-sm text-navy/65 mt-2 line-clamp-2">
                        {p.excerpt}
                      </p>
                    )}
                    <p className="text-[11px] tracking-[0.05em] text-navy/45 mt-3">
                      {(p.person?.name ?? p.author?.name) &&
                        `${p.person?.name ?? p.author?.name} · `}
                      {p.published_at
                        ? `Xuất bản ${formatDate(p.published_at)}`
                        : `Tạo ${formatDate(p.created_at)}`}
                      {p.reading_time && ` · ${p.reading_time} phút đọc`}
                      {p.view_count > 0 && ` · ${p.view_count} views`}
                    </p>
                  </div>

                  <div className="md:col-span-5 flex flex-wrap gap-3 md:justify-end">
                    {p.status === "published" && (
                      <a
                        href={`/an-pham/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-label-caps uppercase px-4 py-2.5 border border-navy/30 text-navy hover:border-gold hover:text-gold transition-colors min-h-[44px]"
                      >
                        <ExternalLink className="size-3" /> Xem
                      </a>
                    )}
                    <Link
                      href={`/admin/posts/edit?id=${p.id}`}
                      className="inline-flex items-center gap-1 text-label-caps uppercase px-4 py-2.5 bg-navy text-cream border border-navy hover:bg-gold hover:text-navy hover:border-gold transition-colors min-h-[44px]"
                    >
                      <Pencil className="size-3" /> Sửa
                    </Link>
                    <button
                      onClick={() => remove(p.id)}
                      className="inline-flex items-center gap-1 text-label-caps uppercase px-4 py-2.5 border border-red-300 text-red-700 hover:bg-red-50 transition-colors min-h-[44px]"
                    >
                      <Trash2 className="size-3" /> Xóa
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
