"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm, type PostFormData } from "@/components/admin/post-form";

export default function EditPostPage() {
  return (
    <Suspense fallback={null}>
      <EditPostInner />
    </Suspense>
  );
}

function EditPostInner() {
  const search = useSearchParams();
  const id = search.get("id");
  const [initial, setInitial] = useState<PostFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Thiếu id");
      setLoading(false);
      return;
    }
    fetch(`/api/admin/posts?id=${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (!data.ok) {
          setError(data.error || "Không tải được");
          setLoading(false);
          return;
        }
        const p = data.post;
        setInitial({
          id: p.id,
          title: p.title ?? "",
          slug: p.slug ?? "",
          excerpt: p.excerpt ?? "",
          cover_url: p.cover_url ?? "",
          body_mdx: p.body_mdx ?? "",
          category_id: p.category?.id ?? p.category_id ?? "",
          author_id: p.author?.id ?? p.author_id ?? "",
          status: p.status ?? "draft",
          scheduled_at: p.scheduled_at
            ? new Date(p.scheduled_at).toISOString().slice(0, 16)
            : "",
          is_featured: p.is_featured ?? false,
          seo_title: p.seo_title ?? "",
          seo_description: p.seo_description ?? "",
        });
        setLoading(false);
      });
  }, [id]);

  return (
    <AdminShell>
      <div className="space-y-6">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-1 text-sm text-navy/60 hover:text-navy"
        >
          <ArrowLeft className="size-4" /> Danh sách bài viết
        </Link>
        <h1 className="font-heading text-3xl font-bold text-navy">Chỉnh sửa bài viết</h1>

        {loading ? (
          <div className="bg-white rounded-2xl border border-cream-300 p-12 text-center text-navy/50">
            Đang tải…
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 border border-red-200 p-4 text-red-800">
            {error}
          </div>
        ) : initial ? (
          <PostForm initial={initial} />
        ) : null}
      </div>
    </AdminShell>
  );
}
