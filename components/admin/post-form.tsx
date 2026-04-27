"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save, AlertCircle, CheckCircle2, Trash2 } from "lucide-react";
import { Button } from "@/components/shared/button";
import { PostEditor } from "@/components/admin/post-editor";
import { viSlugify } from "@/lib/utils";

interface Category {
  id: string;
  slug: string;
  name: string;
}
interface Author {
  id: string;
  slug: string;
  name: string;
  title: string | null;
}

export interface PostFormData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_url: string;
  body_mdx: string;
  category_id: string;
  author_id: string;
  status: "draft" | "scheduled" | "published";
  scheduled_at: string;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
}

export function PostForm({ initial }: { initial: PostFormData | null }) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [data, setData] = useState<PostFormData>(
    initial ?? {
      title: "",
      slug: "",
      excerpt: "",
      cover_url: "",
      body_mdx: "",
      category_id: "",
      author_id: "",
      status: "draft",
      scheduled_at: "",
      is_featured: false,
      seo_title: "",
      seo_description: "",
    },
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/admin/meta", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setCategories(d.categories);
          setAuthors(d.authors);
        }
      });
  }, []);

  function update<K extends keyof PostFormData>(key: K, value: PostFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function autoFillSlug() {
    if (!data.slug && data.title) update("slug", viSlugify(data.title));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    if (!data.title || !data.body_mdx || data.body_mdx === "<p></p>") {
      setError("Tiêu đề và nội dung là bắt buộc");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...data,
        slug: data.slug || viSlugify(data.title),
        scheduled_at: data.scheduled_at || null,
      };

      const url = "/api/admin/posts";
      const method = isEdit ? "PATCH" : "POST";
      const body = isEdit ? { ...payload, id: initial!.id } : payload;

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Lỗi");

      if (!isEdit && json.post?.id) {
        setSuccess("Đã tạo bài viết.");
        setTimeout(() => router.push(`/admin/posts/edit?id=${json.post.id}`), 600);
      } else {
        setSuccess("Đã lưu thay đổi.");
        setTimeout(() => setSuccess(""), 2500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete() {
    if (!isEdit) return;
    if (!confirm("Xóa bài viết này? Không thể khôi phục.")) return;
    const res = await fetch(`/api/admin/posts?id=${initial!.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) router.push("/admin/posts");
  }

  return (
    <form onSubmit={onSubmit} className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-navy mb-1.5">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => update("title", e.target.value)}
            onBlur={autoFillSlug}
            placeholder="VD: Tax Health Check — Framework 7 điểm cho CFO"
            required
            className="w-full rounded-md border border-cream-300 bg-white px-4 py-3 text-lg font-semibold focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 min-h-[52px]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy mb-1.5">
            Slug URL
          </label>
          <div className="flex items-center rounded-md border border-cream-300 bg-cream-50 overflow-hidden">
            <span className="px-3 py-2.5 text-sm text-navy/50 bg-cream-100 border-r border-cream-300">
              /kien-thuc/
            </span>
            <input
              type="text"
              value={data.slug}
              onChange={(e) => update("slug", e.target.value)}
              placeholder="auto từ title"
              className="flex-1 bg-transparent px-3 py-2.5 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy mb-1.5">
            Excerpt (mô tả ngắn)
          </label>
          <textarea
            value={data.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            rows={3}
            maxLength={300}
            placeholder="2-3 câu giới thiệu bài viết — sẽ hiển thị trong list và meta description SEO."
            className="w-full rounded-md border border-cream-300 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
          <p className="text-xs text-navy/40 mt-1">
            {data.excerpt.length}/300 ký tự
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy mb-1.5">
            Nội dung <span className="text-red-500">*</span>
          </label>
          <PostEditor
            content={data.body_mdx}
            onChange={(html) => update("body_mdx", html)}
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
            <AlertCircle className="size-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-2 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
            <CheckCircle2 className="size-4 mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="lg:col-span-4 space-y-5">
        <div className="bg-white rounded-xl border border-cream-300 p-5 space-y-4 lg:sticky lg:top-6">
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">
              Trạng thái
            </label>
            <select
              value={data.status}
              onChange={(e) => update("status", e.target.value as PostFormData["status"])}
              className="w-full rounded-md border border-cream-300 bg-white px-3 py-2 text-sm"
            >
              <option value="draft">Draft (chưa xuất bản)</option>
              <option value="scheduled">Scheduled (lên lịch)</option>
              <option value="published">Published (xuất bản ngay)</option>
            </select>
          </div>

          {data.status === "scheduled" && (
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">
                Lên lịch xuất bản
              </label>
              <input
                type="datetime-local"
                value={data.scheduled_at}
                onChange={(e) => update("scheduled_at", e.target.value)}
                className="w-full rounded-md border border-cream-300 px-3 py-2 text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">
              Tác giả
            </label>
            <select
              value={data.author_id}
              onChange={(e) => update("author_id", e.target.value)}
              className="w-full rounded-md border border-cream-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">— Chưa chọn —</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} {a.title ? `· ${a.title}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">
              Chuyên mục
            </label>
            <select
              value={data.category_id}
              onChange={(e) => update("category_id", e.target.value)}
              className="w-full rounded-md border border-cream-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">— Chưa chọn —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">
              Cover image URL
            </label>
            <input
              type="url"
              value={data.cover_url}
              onChange={(e) => update("cover_url", e.target.value)}
              placeholder="https://..."
              className="w-full rounded-md border border-cream-300 px-3 py-2 text-sm"
            />
            {data.cover_url && (
              <img
                src={data.cover_url}
                alt="Cover preview"
                className="mt-2 rounded-md w-full aspect-video object-cover"
              />
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.is_featured}
              onChange={(e) => update("is_featured", e.target.checked)}
              className="size-4 accent-navy"
            />
            <span className="text-sm text-navy">Bài viết nổi bật (featured)</span>
          </label>

          <details className="border-t border-cream-200 pt-4">
            <summary className="text-sm font-semibold text-navy cursor-pointer">
              SEO
            </summary>
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-xs text-navy/60 mb-1">SEO Title</label>
                <input
                  type="text"
                  value={data.seo_title}
                  onChange={(e) => update("seo_title", e.target.value)}
                  maxLength={60}
                  placeholder="Mặc định: Tiêu đề bài viết"
                  className="w-full rounded-md border border-cream-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-navy/60 mb-1">
                  SEO Description
                </label>
                <textarea
                  value={data.seo_description}
                  onChange={(e) => update("seo_description", e.target.value)}
                  rows={2}
                  maxLength={160}
                  placeholder="Mặc định: Excerpt"
                  className="w-full rounded-md border border-cream-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </details>

          <Button type="submit" size="lg" fullWidth disabled={submitting}>
            <Save className="size-4" />
            {submitting ? "Đang lưu…" : isEdit ? "Lưu thay đổi" : "Tạo bài viết"}
          </Button>

          {isEdit && (
            <button
              type="button"
              onClick={onDelete}
              className="w-full inline-flex items-center justify-center gap-1.5 text-sm text-red-700 hover:bg-red-50 py-2 rounded-md"
            >
              <Trash2 className="size-3.5" /> Xóa bài viết
            </button>
          )}
        </div>
      </aside>
    </form>
  );
}
