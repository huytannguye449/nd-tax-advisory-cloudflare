"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Plus, Save, Trash2, X } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/shared/button";
import { Eyebrow } from "@/components/shared/eyebrow";
import { viSlugify } from "@/lib/utils";

type FieldType = "text" | "textarea" | "number" | "url";

export interface ResourceField {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  placeholder?: string;
}

interface Row {
  id: string;
  name: string;
  slug: string;
  [key: string]: unknown;
}

interface ResourceManagerProps {
  title: string;
  eyebrow: string;
  endpoint: string;
  listKey: string;
  emptyLabel: string;
  fields: ResourceField[];
}

const inputCls =
  "w-full border-b border-navy bg-transparent px-0 py-2 text-body-md text-navy transition-colors focus:border-gold focus:outline-none min-h-[44px]";
const labelCls = "mb-2 block text-label-caps uppercase text-navy/65";

export function ResourceManager({
  title,
  eyebrow,
  endpoint,
  listKey,
  emptyLabel,
  fields,
}: ResourceManagerProps) {
  const empty = useMemo(() => {
    const base: Record<string, string | number> = {};
    for (const field of fields)
      base[field.name] = field.type === "number" ? 0 : "";
    return base;
  }, [fields]);

  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, string | number>>(empty);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch(endpoint, { credentials: "include" });
    const json = await res.json();
    if (json.ok) setRows(json[listKey] ?? []);
    else setError(json.error || "Không tải được dữ liệu");
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, [endpoint, listKey]);

  useEffect(() => setForm(empty), [empty]);

  function startCreate() {
    setEditing(null);
    setForm(empty);
    setError("");
  }

  function startEdit(row: Row) {
    setEditing(row);
    const next: Record<string, string | number> = {};
    for (const field of fields) {
      const value = row[field.name];
      next[field.name] =
        field.type === "number"
          ? Number(value ?? 0)
          : typeof value === "string"
            ? value
            : "";
    }
    setForm(next);
    setError("");
  }

  function update(name: string, value: string | number) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function syncSlug() {
    const name = String(form.name ?? "");
    const slug = String(form.slug ?? "");
    if (!slug && name) update("slug", viSlugify(name));
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      ...form,
      slug: viSlugify(String(form.slug || form.name || "")),
      ...(editing ? { id: editing.id } : {}),
    };

    const res = await fetch(endpoint, {
      method: editing ? "PATCH" : "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      setError(json.error || "Không lưu được");
      setSubmitting(false);
      return;
    }
    await load();
    startCreate();
    setSubmitting(false);
  }

  async function remove(row: Row) {
    if (!confirm(`Xóa "${row.name}"?`)) return;
    const res = await fetch(`${endpoint}?id=${row.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      setError(
        json.error ||
          "Không xóa được. Có thể dữ liệu đang được bài viết sử dụng.",
      );
      return;
    }
    await load();
    if (editing?.id === row.id) startCreate();
  }

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 border-b-hairline border-gold pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow color="gold">{eyebrow}</Eyebrow>
            <h1 className="mt-4 font-heading text-headline-lg text-navy">
              {title}
            </h1>
            <p className="mt-2 text-body-md text-navy/65">{rows.length} mục</p>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={startCreate}
          >
            <Plus className="size-4" /> Tạo mới
          </Button>
        </div>

        <div className="grid gap-[var(--spacing-gutter)] lg:grid-cols-12">
          <form
            onSubmit={save}
            className="space-y-5 border-t-hairline border-gold pt-6 lg:col-span-4"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-headline-sm text-navy">
                {editing ? "Chỉnh sửa" : "Tạo mới"}
              </h2>
              {editing && (
                <button
                  type="button"
                  onClick={startCreate}
                  className="inline-flex items-center gap-1 text-label-caps uppercase text-navy/55 transition-colors hover:text-gold-700"
                >
                  <X className="size-3.5" /> Hủy
                </button>
              )}
            </div>

            {fields.map((field) => (
              <div key={field.name}>
                <label className={labelCls}>
                  {field.label}
                  {field.required && <span className="text-red-600"> *</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    value={String(form[field.name] ?? "")}
                    onChange={(e) => update(field.name, e.target.value)}
                    rows={4}
                    required={field.required}
                    placeholder={field.placeholder}
                    className={inputCls}
                  />
                ) : (
                  <input
                    type={field.type ?? "text"}
                    value={form[field.name] ?? ""}
                    onChange={(e) =>
                      update(
                        field.name,
                        field.type === "number"
                          ? Number(e.target.value)
                          : e.target.value,
                      )
                    }
                    onBlur={field.name === "name" ? syncSlug : undefined}
                    required={field.required}
                    placeholder={field.placeholder}
                    className={inputCls}
                  />
                )}
              </div>
            ))}

            {error && (
              <div className="border-l-2 border-red-500 bg-red-50 p-3 text-body-sm text-red-800">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" fullWidth disabled={submitting}>
              <Save className="size-4" />
              {submitting
                ? "Đang lưu..."
                : editing
                  ? "Lưu thay đổi"
                  : "Tạo mới"}
            </Button>
          </form>

          <div className="lg:col-span-8">
            {loading ? (
              <div className="border-t-hairline border-gold pt-12 text-center text-body-md text-navy/55">
                Đang tải...
              </div>
            ) : rows.length === 0 ? (
              <div className="border-t-hairline border-gold pt-12 text-center text-body-md text-navy/55">
                {emptyLabel}
              </div>
            ) : (
              <ul>
                {rows.map((row) => (
                  <li
                    key={row.id}
                    className="border-t-hairline border-gold py-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <button
                        type="button"
                        onClick={() => startEdit(row)}
                        className="min-w-0 text-left"
                      >
                        <h3 className="font-heading text-headline-sm text-navy transition-colors hover:text-gold-700">
                          {row.name}
                        </h3>
                        <p className="mt-1 text-label-caps text-navy/45">
                          /{row.slug}
                        </p>
                        {"title" in row &&
                          typeof row.title === "string" &&
                          row.title && (
                            <p className="mt-2 text-body-sm text-navy/60">
                              {row.title}
                            </p>
                          )}
                        {"description" in row &&
                          typeof row.description === "string" &&
                          row.description && (
                            <p className="mt-2 line-clamp-2 text-body-sm text-navy/60">
                              {row.description}
                            </p>
                          )}
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(row)}
                        className="inline-flex min-h-[44px] items-center justify-center gap-1.5 border border-red-300 px-4 py-2.5 text-label-caps uppercase text-red-700 transition-colors hover:bg-red-50 md:self-start"
                      >
                        <Trash2 className="size-3.5" /> Xóa
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
