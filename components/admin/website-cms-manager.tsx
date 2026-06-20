"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { ImagePlus, Plus, Save, Trash2, X } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/shared/button";
import { Eyebrow } from "@/components/shared/eyebrow";

type ResourceKey =
  | "page_sections"
  | "client_logos"
  | "site_values"
  | "site_stats"
  | "testimonials"
  | "timeline_items";

type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "url"
  | "status"
  | "select"
  | "checkbox";

interface Field {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  upload?: boolean;
  options?: Array<{ value: string; label: string }>;
}

interface ResourceConfig {
  key: ResourceKey;
  label: string;
  title: string;
  listKey: string;
  primaryField: string;
  fields: Field[];
}

interface CmsRow {
  id: string;
  status?: string;
  display_order?: number;
  [key: string]: unknown;
}

const RESOURCES: ResourceConfig[] = [
  {
    key: "page_sections",
    label: "Page sections",
    title: "Khối nội dung",
    listKey: "page_sections",
    primaryField: "title",
    fields: [
      {
        name: "page_slug",
        label: "Trang",
        type: "select",
        required: true,
        options: [
          { value: "home", label: "Trang chủ" },
          { value: "about", label: "Về chúng tôi" },
        ],
      },
      { name: "section_key", label: "Section key", required: true },
      { name: "eyebrow", label: "Eyebrow" },
      { name: "title", label: "Tiêu đề" },
      { name: "subtitle", label: "Mô tả ngắn", type: "textarea" },
      { name: "body", label: "Nội dung", type: "textarea" },
      { name: "image_url", label: "Ảnh URL", type: "url", upload: true },
      { name: "image_alt", label: "Alt ảnh" },
      { name: "cta_label", label: "CTA label" },
      { name: "cta_href", label: "CTA URL", type: "url" },
      { name: "secondary_cta_label", label: "CTA phụ label" },
      { name: "secondary_cta_href", label: "CTA phụ URL", type: "url" },
      { name: "display_order", label: "Thứ tự", type: "number" },
      { name: "status", label: "Trạng thái", type: "status" },
    ],
  },
  {
    key: "client_logos",
    label: "Client logos",
    title: "Logo khách hàng",
    listKey: "client_logos",
    primaryField: "name",
    fields: [
      { name: "name", label: "Tên", required: true },
      { name: "logo_url", label: "Logo URL", type: "url", upload: true },
      { name: "website_url", label: "Website URL", type: "url" },
      { name: "show_on_home", label: "Hiển thị trên trang chủ", type: "checkbox" },
      { name: "display_order", label: "Thứ tự", type: "number" },
      { name: "status", label: "Trạng thái", type: "status" },
    ],
  },
  {
    key: "site_values",
    label: "Values",
    title: "Giá trị cốt lõi",
    listKey: "site_values",
    primaryField: "title",
    fields: [
      { name: "key", label: "Key", required: true },
      { name: "title", label: "Tiêu đề", required: true },
      { name: "description", label: "Mô tả", type: "textarea" },
      { name: "icon_key", label: "Icon key" },
      { name: "display_order", label: "Thứ tự", type: "number" },
      { name: "status", label: "Trạng thái", type: "status" },
    ],
  },
  {
    key: "site_stats",
    label: "Stats",
    title: "Chỉ số",
    listKey: "site_stats",
    primaryField: "label",
    fields: [
      { name: "value", label: "Giá trị", required: true },
      { name: "label", label: "Nhãn", required: true },
      { name: "display_order", label: "Thứ tự", type: "number" },
      { name: "status", label: "Trạng thái", type: "status" },
    ],
  },
  {
    key: "testimonials",
    label: "Testimonials",
    title: "Nhận xét khách hàng",
    listKey: "testimonials",
    primaryField: "author",
    fields: [
      { name: "quote", label: "Nhận xét", type: "textarea", required: true },
      { name: "author", label: "Tên người nói", required: true },
      { name: "title", label: "Chức danh" },
      { name: "industry", label: "Ngành" },
      { name: "display_order", label: "Thứ tự", type: "number" },
      { name: "status", label: "Trạng thái", type: "status" },
    ],
  },
  {
    key: "timeline_items",
    label: "Timeline",
    title: "Timeline founder",
    listKey: "timeline_items",
    primaryField: "title",
    fields: [
      { name: "page_slug", label: "Page slug" },
      { name: "person_id", label: "Person ID" },
      { name: "period", label: "Giai đoạn", required: true },
      { name: "title", label: "Tiêu đề", required: true },
      { name: "organization", label: "Tổ chức" },
      { name: "description", label: "Mô tả", type: "textarea" },
      { name: "display_order", label: "Thứ tự", type: "number" },
      { name: "status", label: "Trạng thái", type: "status" },
    ],
  },
];

const inputCls =
  "w-full border-b border-navy bg-transparent px-0 py-2 text-body-md text-navy transition-colors focus:border-gold focus:outline-none min-h-[44px]";
const labelCls = "mb-2 block text-label-caps uppercase text-navy/65";

export function WebsiteCmsManager() {
  const [resourceKey, setResourceKey] = useState<ResourceKey>("page_sections");
  const config = useMemo(
    () => RESOURCES.find((item) => item.key === resourceKey) ?? RESOURCES[0],
    [resourceKey],
  );
  const empty = useMemo(() => buildEmpty(config.fields), [config]);
  const [rows, setRows] = useState<CmsRow[]>([]);
  const [editing, setEditing] = useState<CmsRow | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(empty);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/site-content?resource=${resourceKey}`, {
      credentials: "include",
    });
    const json = await res.json();
    if (json.ok) setRows(json[config.listKey] ?? []);
    else setError(json.error || "Không tải được dữ liệu");
    setLoading(false);
  }

  useEffect(() => {
    setEditing(null);
    setForm(empty);
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceKey]);

  function startCreate() {
    setEditing(null);
    setForm(empty);
    setError("");
  }

  function startEdit(row: CmsRow) {
    const next = buildEmpty(config.fields);
    for (const field of config.fields) {
      next[field.name] = row[field.name] ?? next[field.name];
    }
    setEditing(row);
    setForm(next);
    setError("");
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const payload = serializePayload(form, config.fields);
    if (editing) payload.id = editing.id;
    const res = await fetch(`/api/admin/site-content?resource=${resourceKey}`, {
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

  async function remove(row: CmsRow) {
    const name = String(row[config.primaryField] ?? row.id);
    if (!confirm(`Xóa "${name}"?`)) return;
    const res = await fetch(
      `/api/admin/site-content?resource=${resourceKey}&id=${row.id}`,
      { method: "DELETE", credentials: "include" },
    );
    const json = await res.json();
    if (!res.ok || !json.ok) {
      setError(json.error || "Không xóa được");
      return;
    }
    await load();
    if (editing?.id === row.id) startCreate();
  }

  async function upload(field: Field, file: File | null) {
    if (!file) return;
    setError("");
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "site");
    data.append("entityId", editing?.id ?? "new");
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      credentials: "include",
      body: data,
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      setError(json.error || "Upload thất bại");
      return;
    }
    setForm((prev) => ({ ...prev, [field.name]: json.url }));
  }

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="border-b-hairline border-gold pb-6">
          <Eyebrow color="gold">Website CMS</Eyebrow>
          <h1 className="mt-4 font-heading text-headline-lg text-navy">
            Nội dung website
          </h1>
          <p className="mt-2 max-w-2xl text-body-md text-navy/65">
            Quản trị các khối nội dung public của trang chủ và trang về chúng tôi.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 border-b-hairline border-gold pb-4">
          {RESOURCES.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setResourceKey(item.key)}
              className={[
                "min-h-[40px] border px-4 py-2 text-label-caps uppercase transition-colors",
                item.key === resourceKey
                  ? "border-gold bg-gold text-navy"
                  : "border-navy/15 text-navy/65 hover:border-gold hover:text-gold-700",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid gap-[var(--spacing-gutter)] lg:grid-cols-12">
          <form
            onSubmit={save}
            className="space-y-5 border-t-hairline border-gold pt-6 lg:col-span-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-headline-sm text-navy">
                {editing ? `Sửa ${config.title}` : `Tạo ${config.title}`}
              </h2>
              <div className="flex items-center gap-3">
                <Button type="button" size="sm" variant="secondary" onClick={startCreate}>
                  <Plus className="size-4" /> Mới
                </Button>
                {editing && (
                  <button
                    type="button"
                    onClick={startCreate}
                    className="inline-flex items-center gap-1 text-label-caps uppercase text-navy/55 hover:text-gold-700"
                  >
                    <X className="size-3.5" /> Hủy
                  </button>
                )}
              </div>
            </div>

            {config.fields.map((field) => (
              <FieldControl
                key={field.name}
                field={field}
                value={form[field.name]}
                onChange={(name, value) =>
                  setForm((prev) => ({ ...prev, [name]: value }))
                }
                onUpload={upload}
              />
            ))}

            {error && (
              <div className="border-l-2 border-red-500 bg-red-50 p-3 text-body-sm text-red-800">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" fullWidth disabled={submitting}>
              <Save className="size-4" />
              {submitting ? "Đang lưu..." : editing ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </form>

          <div className="lg:col-span-7">
            {loading ? (
              <div className="border-t-hairline border-gold pt-12 text-center text-body-md text-navy/55">
                Đang tải...
              </div>
            ) : rows.length === 0 ? (
              <div className="border-t-hairline border-gold pt-12 text-center text-body-md text-navy/55">
                Chưa có nội dung.
              </div>
            ) : (
              <ul>
                {rows.map((row) => (
                  <li key={row.id} className="border-t-hairline border-gold py-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <button
                        type="button"
                        onClick={() => startEdit(row)}
                        className="min-w-0 text-left"
                      >
                        <p className="text-label-caps uppercase text-navy/45">
                          {row.status ?? "draft"} · order {row.display_order ?? 0}
                        </p>
                        <h3 className="mt-2 font-heading text-headline-sm text-navy transition-colors hover:text-gold-700">
                          {String(row[config.primaryField] ?? row.id)}
                        </h3>
                        {typeof row.subtitle === "string" && (
                          <p className="mt-2 line-clamp-2 text-body-sm text-navy/60">
                            {row.subtitle}
                          </p>
                        )}
                        {typeof row.quote === "string" && (
                          <p className="mt-2 line-clamp-2 text-body-sm text-navy/60">
                            {row.quote}
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

function FieldControl({
  field,
  value,
  onChange,
  onUpload,
}: {
  field: Field;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
  onUpload: (field: Field, file: File | null) => void;
}) {
  const common = {
    value: typeof value === "string" || typeof value === "number" ? value : "",
    onChange: (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) =>
      onChange(
        field.name,
        field.type === "number" ? Number(e.target.value) : e.target.value,
      ),
    required: field.required,
    className: inputCls,
  };

  if (field.type === "checkbox") {
    return (
      <label className="flex min-h-[44px] items-center gap-3 border-t-hairline border-gold pt-4 text-body-md text-navy">
        <input
          type="checkbox"
          checked={value === true}
          onChange={(e) => onChange(field.name, e.target.checked)}
          className="size-4 accent-gold"
        />
        <span>{field.label}</span>
      </label>
    );
  }

  return (
    <div>
      <label className={labelCls}>
        {field.label}
        {field.required && <span className="text-red-600"> *</span>}
      </label>
      {field.type === "textarea" ? (
        <textarea {...common} rows={5} />
      ) : field.type === "status" ? (
        <select {...common}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      ) : field.type === "select" ? (
        <select {...common}>
          <option value="">Chọn</option>
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input {...common} type={field.type === "number" ? "number" : field.type ?? "text"} />
      )}
      {field.upload && (
        <div className="mt-3 flex items-center gap-3">
          <label className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 border border-navy/20 px-3 py-2 text-label-caps uppercase text-navy/65 transition-colors hover:border-gold hover:text-gold-700">
            <ImagePlus className="size-4" />
            Upload ảnh
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => void onUpload(field, e.target.files?.[0] ?? null)}
            />
          </label>
          {typeof value === "string" && value && (
            <span className="truncate text-body-sm text-navy/45">Đã có ảnh</span>
          )}
        </div>
      )}
    </div>
  );
}

function buildEmpty(fields: Field[]) {
  const empty: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.type === "number") empty[field.name] = 0;
    else if (field.type === "status") empty[field.name] = "draft";
    else if (field.type === "checkbox") empty[field.name] = false;
    else empty[field.name] = "";
  }
  return empty;
}

function serializePayload(form: Record<string, unknown>, fields: Field[]) {
  const payload: Record<string, unknown> = {};
  for (const field of fields) {
    const value = form[field.name];
    if (field.type === "number") payload[field.name] = Number(value ?? 0);
    else if (field.type === "checkbox") payload[field.name] = value === true;
    else payload[field.name] = emptyStringToNull(value);
  }
  return payload;
}

function emptyStringToNull(value: unknown) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
