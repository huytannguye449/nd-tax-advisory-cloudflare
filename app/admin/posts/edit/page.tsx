"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm, type PostFormData } from "@/components/admin/post-form";
import { Eyebrow } from "@/components/shared/eyebrow";

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
          people_id: p.person?.id ?? p.people_id ?? "",
          tag_ids: p.tag_ids ?? [],
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
      <div className="space-y-8">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-1 text-label-caps uppercase text-navy/65 hover:text-gold-700 transition-colors"
        >
          <ArrowLeft className="size-4" /> Danh sách bài viết
        </Link>
        <div className="border-b-hairline border-gold pb-6">
          <Eyebrow color="gold">Edit Post</Eyebrow>
          <h1 className="text-headline-lg font-heading text-navy mt-4">
            Chỉnh sửa bài viết
          </h1>
        </div>

        {loading ? (
          <div className="border-t-hairline border-gold pt-12 text-center text-body-md text-navy/55">
            Đang tải…
          </div>
        ) : error ? (
          <div className="border-l-2 border-red-500 bg-red-50 p-4 text-body-sm text-red-800">
            {error}
          </div>
        ) : initial ? (
          <PostForm initial={initial} />
        ) : null}
      </div>
    </AdminShell>
  );
}
