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
import { viSlugify } from "@/lib/utils";

type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "url"
  | "tel"
  | "status"
  | "date"
  | "checkbox"
  | "lines"
  | "social";

interface Field {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  uploadFolder?: "people" | "services" | "events";
  options?: Array<{ value: string; label: string }>;
}

interface Row {
  id: string;
  slug: string;
  name?: string;
  title?: string;
  status?: string;
  display_order?: number;
  [key: string]: unknown;
}

interface PersonOption {
  id: string;
  name: string;
  title: string | null;
}

interface Props {
  title: string;
  eyebrow: string;
  endpoint: string;
  listKey: string;
  itemKey: string;
  emptyLabel: string;
  fields: Field[];
  assignPeople?: boolean;
}

const inputCls =
  "w-full border-b border-navy bg-transparent px-0 py-2 text-body-md text-navy transition-colors focus:border-gold focus:outline-none min-h-[44px]";
const labelCls = "mb-2 block text-label-caps uppercase text-navy/65";

export function BusinessCmsManager({
  title,
  eyebrow,
  endpoint,
  listKey,
  itemKey,
  emptyLabel,
  fields,
  assignPeople,
}: Props) {
  const empty = useMemo(() => {
    const next: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.type === "number") next[field.name] = 0;
      else if (field.type === "checkbox") next[field.name] = false;
      else next[field.name] = "";
    }
    if (assignPeople) next.people_ids = [];
    return next;
  }, [assignPeople, fields]);

  const [rows, setRows] = useState<Row[]>([]);
  const [people, setPeople] = useState<PersonOption[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(empty);
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

  useEffect(() => {
    if (!assignPeople) return;
    fetch("/api/admin/people", { credentials: "include" })
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) setPeople(json.people ?? []);
      });
  }, [assignPeople]);

  function startCreate() {
    setEditing(null);
    setForm(empty);
    setError("");
  }

  function startEdit(row: Row) {
    setEditing(row);
    const next: Record<string, unknown> = {};
    for (const field of fields) {
      const value = row[field.name];
      if (field.type === "lines")
        next[field.name] = Array.isArray(value) ? value.join("\n") : "";
      else if (field.type === "social") next[field.name] = socialToLines(value);
      else if (field.type === "date" && typeof value === "string" && value)
        next[field.name] = value.slice(0, 16);
      else if (field.type === "checkbox") next[field.name] = Boolean(value);
      else next[field.name] = value ?? (field.type === "number" ? 0 : "");
    }
    if (assignPeople) {
      next.people_ids = Array.isArray(row.service_people)
        ? row.service_people
            .map((rel) => (rel as { person?: { id?: string } }).person?.id)
            .filter((id): id is string => typeof id === "string")
            .map((id) => id.trim())
            .filter(Boolean)
        : [];
    }
    setForm(next);
    setError("");
  }

  function update(name: string, value: unknown) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function upload(field: Field, file: File | null) {
    if (!file || !field.uploadFolder) return;
    setError("");
    const data = new FormData();
    data.append("file", file);
    data.append("folder", field.uploadFolder);
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
    update(field.name, json.url);
  }

  function togglePerson(id: string) {
    const current = Array.isArray(form.people_ids)
      ? (form.people_ids as string[])
      : [];
    update(
      "people_ids",
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const payload = serializePayload(form, fields);
    if (!payload.slug && payload.name)
      payload.slug = viSlugify(String(payload.name));
    if (!payload.slug && payload.title)
      payload.slug = viSlugify(String(payload.title));
    if (editing) payload.id = editing.id;
    if (assignPeople) payload.people_ids = cleanIdList(form.people_ids);

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
    if (!confirm(`Xóa "${row.name ?? row.title}"?`)) return;
    const res = await fetch(`${endpoint}?id=${row.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      setError(json.error || "Không xóa được");
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
            className="space-y-5 border-t-hairline border-gold pt-6 lg:col-span-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-headline-sm text-navy">
                {editing ? "Chỉnh sửa" : "Tạo mới"}
              </h2>
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

            {fields.map((field) => (
              <FieldControl
                key={field.name}
                field={field}
                value={form[field.name]}
                onChange={update}
                onUpload={upload}
              />
            ))}

            {assignPeople && (
              <div>
                <label className={labelCls}>Chuyên gia phụ trách</label>
                <div className="flex flex-wrap gap-2">
                  {people.map((person) => {
                    const selected =
                      Array.isArray(form.people_ids) &&
                      (form.people_ids as string[]).includes(person.id);
                    return (
                      <label
                        key={person.id}
                        className="inline-flex min-h-[36px] cursor-pointer items-center gap-2 border border-cream-300 px-3 py-1.5 text-body-sm text-navy/70 hover:border-gold"
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => togglePerson(person.id)}
                          className="size-3.5 accent-gold"
                        />
                        {person.name}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

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

          <div className="lg:col-span-7">
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
                        <p className="text-label-caps uppercase text-navy/45">
                          {row.status ?? "draft"} · /{row.slug}
                        </p>
                        <h3 className="mt-2 font-heading text-headline-sm text-navy transition-colors hover:text-gold-700">
                          {row.name ?? row.title}
                        </h3>
                        {typeof row.title === "string" && row.name && (
                          <p className="mt-1 text-body-sm text-navy/60">
                            {row.title}
                          </p>
                        )}
                        {typeof row.short_description === "string" && (
                          <p className="mt-2 line-clamp-2 text-body-sm text-navy/60">
                            {row.short_description}
                          </p>
                        )}
                        {typeof row.excerpt === "string" && (
                          <p className="mt-2 line-clamp-2 text-body-sm text-navy/60">
                            {row.excerpt}
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
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      onChange(
        field.name,
        field.type === "number" ? Number(e.target.value) : e.target.value,
      ),
    required: field.required,
    className: inputCls,
  };

  return (
    <div>
      <label className={labelCls}>
        {field.label}
        {field.required && <span className="text-red-600"> *</span>}
      </label>
      {field.type === "textarea" ||
      field.type === "lines" ||
      field.type === "social" ? (
        <textarea {...common} rows={field.type === "textarea" ? 4 : 5} />
      ) : field.type === "status" ? (
        <select {...common}>
          {(field.options ?? [
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
          ]).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === "checkbox" ? (
        <label className="inline-flex min-h-[44px] items-center gap-3 text-body-md text-navy">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(field.name, e.target.checked)}
            className="size-4 accent-gold"
          />
          Bật
        </label>
      ) : (
        <input
          {...common}
          type={
            field.type === "date" ? "datetime-local" : (field.type ?? "text")
          }
        />
      )}
      {field.uploadFolder && (
        <div className="mt-3 flex items-center gap-3">
          <label className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 border border-navy/20 px-3 py-2 text-label-caps uppercase text-navy/65 transition-colors hover:border-gold hover:text-gold-700">
            <ImagePlus className="size-4" />
            Upload ảnh
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) =>
                void onUpload(field, e.target.files?.[0] ?? null)
              }
            />
          </label>
          {typeof value === "string" && value && (
            <span className="truncate text-body-sm text-navy/45">
              Đã có ảnh
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function serializePayload(form: Record<string, unknown>, fields: Field[]) {
  const payload: Record<string, unknown> = {};
  for (const field of fields) {
    const value = form[field.name];
    if (field.type === "lines") payload[field.name] = linesToArray(value);
    else if (field.type === "social")
      payload[field.name] = linesToSocial(value);
    else payload[field.name] = emptyStringToNull(value);
  }
  return payload;
}

function emptyStringToNull(value: unknown) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function cleanIdList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [
    ...new Set(
      value
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean),
    ),
  ];
}

function linesToArray(value: unknown) {
  if (typeof value !== "string") return [];
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function linesToSocial(value: unknown) {
  if (typeof value !== "string") return {};
  return Object.fromEntries(
    value
      .split("\n")
      .map((line) => line.split("="))
      .filter(([key, val]) => key?.trim() && val?.trim())
      .map(([key, val]) => [key.trim(), val.trim()]),
  );
}

function socialToLines(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";
  return Object.entries(value as Record<string, unknown>)
    .filter(([, val]) => typeof val === "string" && val)
    .map(([key, val]) => `${key}=${val}`)
    .join("\n");
}
