"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Star, ExternalLink } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/shared/button";
import { formatDate } from "@/lib/utils";

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
  author: { name: string; slug: string } | null;
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  published: "Published",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-cream-200 text-navy/60",
  scheduled: "bg-blue-50 text-blue-700",
  published: "bg-green-50 text-green-700",
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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-navy">Bài viết</h1>
            <p className="text-navy/60 mt-1">{posts.length} bài viết</p>
          </div>
          <Button asChild>
            <Link href="/admin/posts/new">
              <Plus className="size-4" /> Viết bài mới
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {["all", "draft", "scheduled", "published"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-2 text-sm font-medium border transition min-h-[36px] ${
                filter === s
                  ? "bg-navy text-cream border-navy"
                  : "bg-white text-navy/70 border-cream-300 hover:border-navy/30"
              }`}
            >
              {s === "all" ? "Tất cả" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-cream-300 p-12 text-center text-navy/50">
            Đang tải…
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-cream-300 p-12 text-center">
            <p className="text-navy/50 mb-4">Chưa có bài viết nào.</p>
            <Button asChild>
              <Link href="/admin/posts/new">
                <Plus className="size-4" /> Viết bài đầu tiên
              </Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {posts.map((p) => (
              <li
                key={p.id}
                className="bg-white rounded-xl border border-cream-300 p-5 hover:shadow-sm transition"
              >
                <div className="grid md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-7 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          STATUS_COLORS[p.status]
                        }`}
                      >
                        {STATUS_LABELS[p.status]}
                      </span>
                      {p.is_featured && (
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-gold/15 text-gold-700 inline-flex items-center gap-1">
                          <Star className="size-3" /> Featured
                        </span>
                      )}
                      {p.category && (
                        <span className="text-xs text-navy/50">
                          {p.category.name}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-navy text-lg leading-snug">
                      {p.title}
                    </h3>
                    {p.excerpt && (
                      <p className="text-sm text-navy/60 mt-1 line-clamp-2">
                        {p.excerpt}
                      </p>
                    )}
                    <p className="text-xs text-navy/40 mt-2">
                      {p.author?.name && `${p.author.name} · `}
                      {p.published_at
                        ? `Xuất bản ${formatDate(p.published_at)}`
                        : `Tạo ${formatDate(p.created_at)}`}
                      {p.reading_time && ` · ${p.reading_time} phút đọc`}
                      {p.view_count > 0 && ` · ${p.view_count} views`}
                    </p>
                  </div>

                  <div className="md:col-span-5 flex flex-wrap gap-2 md:justify-end">
                    {p.status === "published" && (
                      <a
                        href={`/kien-thuc/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-cream-100 text-navy hover:bg-cream-200"
                      >
                        <ExternalLink className="size-3" /> Xem
                      </a>
                    )}
                    <Link
                      href={`/admin/posts/edit?id=${p.id}`}
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-navy text-cream hover:bg-navy-700"
                    >
                      <Pencil className="size-3" /> Sửa
                    </Link>
                    <button
                      onClick={() => remove(p.id)}
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-red-50 text-red-700 hover:bg-red-100"
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
