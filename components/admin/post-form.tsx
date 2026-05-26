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
interface Person {
  id: string;
  slug: string;
  name: string;
  title: string | null;
}
interface Tag {
  id: string;
  slug: string;
  name: string;
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
  people_id: string;
  tag_ids: string[];
  status: "draft" | "scheduled" | "published";
  scheduled_at: string;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
}

const inputCls =
  "w-full border-b border-navy bg-transparent px-0 py-2 text-body-md text-navy focus:border-gold focus:outline-none transition-colors min-h-[44px]";
const labelCls = "block text-label-caps uppercase text-navy/70 mb-3";

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
      people_id: "",
      tag_ids: [],
      status: "draft",
      scheduled_at: "",
      is_featured: false,
      seo_title: "",
      seo_description: "",
    },
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
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
          setPeople(d.people ?? d.authors ?? []);
          setTags(d.tags ?? []);
        }
      });
  }, []);

  function update<K extends keyof PostFormData>(
    key: K,
    value: PostFormData[K],
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function autoFillSlug() {
    if (!data.slug && data.title) update("slug", viSlugify(data.title));
  }

  function toggleTag(tagId: string) {
    setData((prev) => ({
      ...prev,
      tag_ids: prev.tag_ids.includes(tagId)
        ? prev.tag_ids.filter((id) => id !== tagId)
        : [...prev.tag_ids, tagId],
    }));
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
        slug: viSlugify(data.slug || data.title),
        category_id: data.category_id || null,
        author_id: data.author_id || null,
        people_id: data.people_id || null,
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
        setTimeout(
          () => router.push(`/admin/posts/edit?id=${json.post.id}`),
          600,
        );
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
    <form
      onSubmit={onSubmit}
      className="grid lg:grid-cols-12 gap-[var(--spacing-gutter)]"
    >
      <div className="lg:col-span-8 space-y-7">
        <div>
          <label className={labelCls}>
            Tiêu đề <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => update("title", e.target.value)}
            onBlur={autoFillSlug}
            placeholder="VD: Tax Health Check — Framework 7 điểm cho CFO"
            required
            className="w-full border-b border-navy bg-transparent px-0 py-3 text-headline-sm font-heading text-navy focus:border-gold focus:outline-none transition-colors min-h-[52px]"
          />
        </div>

        <div>
          <label className={labelCls}>Slug URL</label>
          <div className="flex items-center border-b border-navy">
            <span className="text-label-caps uppercase text-navy/55 pr-3 border-r border-navy/20">
              /an-pham/
            </span>
            <input
              type="text"
              value={data.slug}
              onChange={(e) => update("slug", e.target.value)}
              placeholder="auto từ title"
              className="flex-1 bg-transparent pl-3 py-2 text-body-md focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Excerpt (mô tả ngắn)</label>
          <textarea
            value={data.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            rows={3}
            maxLength={300}
            placeholder="2-3 câu giới thiệu bài viết — sẽ hiển thị trong list và meta description SEO."
            className="w-full border-b border-navy bg-transparent px-0 py-2 text-body-md focus:border-gold focus:outline-none transition-colors"
          />
          <p className="text-[11px] tracking-[0.05em] text-navy/45 mt-2">
            {data.excerpt.length}/300 ký tự
          </p>
        </div>

        <div>
          <label className={labelCls}>
            Nội dung <span className="text-red-600">*</span>
          </label>
          <PostEditor
            content={data.body_mdx}
            onChange={(html) => update("body_mdx", html)}
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 border-l-2 border-red-500 bg-red-50 p-3 text-body-sm text-red-800">
            <AlertCircle className="size-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-2 border-l-2 border-green-600 bg-green-50 p-3 text-body-sm text-green-800">
            <CheckCircle2 className="size-4 mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}
      </div>

      {/* Sidebar — flat, hairline-top */}
      <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6 lg:self-start border-t-hairline border-gold pt-6">
        <div>
          <label className={labelCls}>Trạng thái</label>
          <select
            value={data.status}
            onChange={(e) =>
              update("status", e.target.value as PostFormData["status"])
            }
            className={inputCls}
          >
            <option value="draft">Draft (chưa xuất bản)</option>
            <option value="scheduled">Scheduled (lên lịch)</option>
            <option value="published">Published (xuất bản ngay)</option>
          </select>
        </div>

        {data.status === "scheduled" && (
          <div>
            <label className={labelCls}>Lên lịch xuất bản</label>
            <input
              type="datetime-local"
              value={data.scheduled_at}
              onChange={(e) => update("scheduled_at", e.target.value)}
              className={inputCls}
            />
          </div>
        )}

        <div>
          <label className={labelCls}>People / Tác giả</label>
          <select
            value={data.people_id || data.author_id}
            onChange={(e) => {
              update("people_id", e.target.value);
              update("author_id", "");
            }}
            className={inputCls}
          >
            <option value="">— Chưa chọn —</option>
            {people.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} {a.title ? `· ${a.title}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Chuyên mục</label>
          <select
            value={data.category_id}
            onChange={(e) => update("category_id", e.target.value)}
            className={inputCls}
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
          <label className={labelCls}>Tags</label>
          {tags.length === 0 ? (
            <p className="text-body-sm text-navy/45">Chưa có tag nào.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <label
                  key={tag.id}
                  className="inline-flex min-h-[36px] cursor-pointer items-center gap-2 border border-cream-300 bg-white px-3 py-1.5 text-body-sm text-navy/70 transition-colors hover:border-gold"
                >
                  <input
                    type="checkbox"
                    checked={data.tag_ids.includes(tag.id)}
                    onChange={() => toggleTag(tag.id)}
                    className="size-3.5 accent-gold"
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className={labelCls}>Cover image URL</label>
          <input
            type="url"
            value={data.cover_url}
            onChange={(e) => update("cover_url", e.target.value)}
            placeholder="https://..."
            className={inputCls}
          />
          {data.cover_url && (
            <img
              src={data.cover_url}
              alt="Cover preview"
              className="mt-3 w-full aspect-video object-cover border-t-hairline border-gold pt-2"
            />
          )}
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.is_featured}
            onChange={(e) => update("is_featured", e.target.checked)}
            className="size-4 accent-gold"
          />
          <span className="text-body-md text-navy">
            Bài viết nổi bật (featured)
          </span>
        </label>

        <details className="border-t-hairline border-gold/40 pt-5">
          <summary className="text-label-caps uppercase text-navy cursor-pointer">
            SEO
          </summary>
          <div className="mt-4 space-y-5">
            <div>
              <label className="block text-[11px] tracking-[0.05em] uppercase text-navy/55 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                value={data.seo_title}
                onChange={(e) => update("seo_title", e.target.value)}
                maxLength={60}
                placeholder="Mặc định: Tiêu đề bài viết"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[11px] tracking-[0.05em] uppercase text-navy/55 mb-2">
                SEO Description
              </label>
              <textarea
                value={data.seo_description}
                onChange={(e) => update("seo_description", e.target.value)}
                rows={2}
                maxLength={160}
                placeholder="Mặc định: Excerpt"
                className={inputCls}
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
            className="w-full inline-flex items-center justify-center gap-1.5 text-label-caps uppercase text-red-700 hover:bg-red-50 py-3 transition-colors min-h-[44px]"
          >
            <Trash2 className="size-3.5" /> Xóa bài viết
          </button>
        )}
      </aside>
    </form>
  );
}
