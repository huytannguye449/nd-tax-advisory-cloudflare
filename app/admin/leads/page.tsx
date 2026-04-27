"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Building2, X, ChevronDown } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/shared/button";
import { formatDate } from "@/lib/utils";

interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company: string | null;
  company_size: string | null;
  services: string[] | null;
  message: string | null;
  source: string | null;
  status: string;
  internal_notes: string | null;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  qualified: "Tiềm năng",
  closed: "Đã đóng",
  spam: "Spam",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-gold/15 text-gold-700",
  contacted: "bg-blue-50 text-blue-700",
  qualified: "bg-green-50 text-green-700",
  closed: "bg-cream-200 text-navy/60",
  spam: "bg-red-50 text-red-700",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Lead | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch(
      `/api/admin/leads?status=${filter}`,
      { credentials: "include" },
    );
    const data = await res.json();
    if (data.ok) setLeads(data.leads);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, [filter]);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/leads", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l)),
    );
    if (selected?.id === id) setSelected({ ...selected, status });
  }

  async function updateNotes(id: string, notes: string) {
    await fetch("/api/admin/leads", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, internal_notes: notes }),
    });
  }

  function exportCsv() {
    const rows = [
      ["Họ tên", "Email", "SĐT", "Công ty", "Quy mô", "Dịch vụ", "Trạng thái", "Ghi chú", "Ngày"],
      ...leads.map((l) => [
        l.full_name,
        l.email,
        l.phone,
        l.company ?? "",
        l.company_size ?? "",
        l.services?.join("; ") ?? "",
        STATUS_LABELS[l.status] ?? l.status,
        l.internal_notes ?? "",
        new Date(l.created_at).toLocaleString("vi-VN"),
      ]),
    ];
    const csv = rows
      .map((r) =>
        r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-navy">Quản lý Lead</h1>
            <p className="text-navy/60 mt-1">{leads.length} bản ghi</p>
          </div>
          <Button variant="outline" onClick={exportCsv} disabled={!leads.length}>
            Xuất CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {["all", "new", "contacted", "qualified", "closed", "spam"].map((s) => (
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

        {/* Table desktop / Cards mobile */}
        <div className="bg-white rounded-2xl border border-cream-300 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-navy/50">Đang tải…</div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center text-navy/50">Không có lead nào.</div>
          ) : (
            <>
              {/* Desktop table */}
              <table className="hidden md:table w-full text-sm">
                <thead className="bg-cream-100 text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-navy">Họ tên</th>
                    <th className="px-4 py-3 font-semibold text-navy">Liên hệ</th>
                    <th className="px-4 py-3 font-semibold text-navy">Công ty</th>
                    <th className="px-4 py-3 font-semibold text-navy">Trạng thái</th>
                    <th className="px-4 py-3 font-semibold text-navy">Ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr
                      key={l.id}
                      onClick={() => setSelected(l)}
                      className="border-t border-cream-200 hover:bg-cream-50 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-medium text-navy">{l.full_name}</td>
                      <td className="px-4 py-3 text-navy/70">
                        <div className="flex items-center gap-1.5">
                          <Mail className="size-3.5 text-navy/40" />
                          {l.email}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                          <Phone className="size-3 text-navy/40" />
                          {l.phone}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-navy/70">{l.company ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            STATUS_COLORS[l.status] ?? ""
                          }`}
                        >
                          {STATUS_LABELS[l.status] ?? l.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-navy/60 text-xs">
                        {formatDate(l.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile cards */}
              <ul className="md:hidden divide-y divide-cream-200">
                {leads.map((l) => (
                  <li
                    key={l.id}
                    onClick={() => setSelected(l)}
                    className="p-4 hover:bg-cream-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-navy truncate">
                          {l.full_name}
                        </p>
                        <p className="text-xs text-navy/60 mt-0.5">
                          {l.email} · {l.phone}
                        </p>
                        {l.company && (
                          <p className="text-xs text-navy/50 mt-0.5">
                            <Building2 className="inline size-3 mr-1" />
                            {l.company}
                          </p>
                        )}
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                          STATUS_COLORS[l.status] ?? ""
                        }`}
                      >
                        {STATUS_LABELS[l.status] ?? l.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Drawer */}
      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onStatusChange={(s) => updateStatus(selected.id, s)}
          onNotesChange={(n) => {
            setSelected({ ...selected, internal_notes: n });
            void updateNotes(selected.id, n);
          }}
        />
      )}
    </AdminShell>
  );
}

function LeadDrawer({
  lead,
  onClose,
  onStatusChange,
  onNotesChange,
}: {
  lead: Lead;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  onNotesChange: (notes: string) => void;
}) {
  const [notes, setNotes] = useState(lead.internal_notes ?? "");

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-navy/40" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl flex flex-col">
        <header className="px-6 py-5 border-b border-cream-300 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-navy">{lead.full_name}</h2>
            <p className="text-sm text-navy/60 mt-1">{formatDate(lead.created_at)}</p>
          </div>
          <button onClick={onClose} aria-label="Đóng" className="p-2 -m-2">
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <Field label="Email">
            <a href={`mailto:${lead.email}`} className="text-gold-700">
              {lead.email}
            </a>
          </Field>
          <Field label="SĐT">
            <a href={`tel:${lead.phone}`} className="text-gold-700">
              {lead.phone}
            </a>
          </Field>
          {lead.company && <Field label="Công ty">{lead.company}</Field>}
          {lead.company_size && <Field label="Quy mô">{lead.company_size}</Field>}
          {lead.services?.length && (
            <Field label="Dịch vụ">{lead.services.join(", ")}</Field>
          )}
          {lead.source && <Field label="Nguồn">{lead.source}</Field>}
          {lead.message && (
            <Field label="Lời nhắn">
              <p className="whitespace-pre-wrap">{lead.message}</p>
            </Field>
          )}

          <div>
            <label className="block text-sm font-semibold text-navy mb-2">
              Trạng thái
            </label>
            <div className="relative">
              <select
                value={lead.status}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full appearance-none rounded-md border border-cream-300 bg-white px-4 py-2.5 pr-10 text-sm font-medium"
              >
                <option value="new">Mới</option>
                <option value="contacted">Đã liên hệ</option>
                <option value="qualified">Tiềm năng</option>
                <option value="closed">Đã đóng</option>
                <option value="spam">Spam</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-2">
              Ghi chú nội bộ
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => onNotesChange(notes)}
              rows={4}
              className="w-full rounded-md border border-cream-300 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
              placeholder="Note follow-up, đánh giá..."
            />
            <p className="text-xs text-navy/40 mt-1">Lưu tự động khi click ra ngoài.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-navy/50 mb-1">
        {label}
      </p>
      <div className="text-sm text-navy">{children}</div>
    </div>
  );
}
