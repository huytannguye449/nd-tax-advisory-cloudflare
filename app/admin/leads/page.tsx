"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Building2, X, ChevronDown } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/shared/button";
import { Eyebrow } from "@/components/shared/eyebrow";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company: string | null;
  company_size: string | null;
  services: string[] | null;
  meeting_type: "online" | "offline" | null;
  meeting_link: string | null;
  message: string | null;
  source: string | null;
  status: string;
  internal_notes: string | null;
  created_at: string;
}

type LeadPatch = Partial<
  Pick<Lead, "status" | "meeting_type" | "meeting_link" | "internal_notes">
>;

const STATUS_LABELS: Record<string, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  qualified: "Tiềm năng",
  closed: "Đã đóng",
  spam: "Spam",
};

const STATUS_COLORS: Record<string, string> = {
  new: "border-l-gold text-gold-700",
  contacted: "border-l-blue-600 text-blue-700",
  qualified: "border-l-green-600 text-green-700",
  closed: "border-l-navy/30 text-navy/60",
  spam: "border-l-red-500 text-red-700",
};

const MEETING_LABELS: Record<string, string> = {
  online: "Online",
  offline: "Truc tiep",
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

  async function patchLead(id: string, body: LeadPatch) {
    const res = await fetch("/api/admin/leads", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) return false;

    const normalized: LeadPatch =
      body.meeting_type === "offline" ? { ...body, meeting_link: null } : body;

    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...normalized } : l)),
    );
    if (selected?.id === id) setSelected({ ...selected, ...normalized });
    return true;
  }

  async function updateStatus(id: string, status: string) {
    await patchLead(id, { status });
  }

  async function updateNotes(id: string, notes: string) {
    await patchLead(id, { internal_notes: notes });
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
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b-hairline border-gold pb-6">
          <div>
            <Eyebrow color="gold">Lead Management</Eyebrow>
            <h1 className="text-headline-lg font-heading text-navy mt-4">Quản lý Lead</h1>
            <p className="text-body-md text-navy/65 mt-2">{leads.length} bản ghi</p>
          </div>
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={!leads.length}>
            Xuất CSV
          </Button>
        </div>

        {/* Filters — sharp rectangular tabs */}
        <div className="flex flex-wrap gap-0 border-b-hairline border-gold/30">
          {["all", "new", "contacted", "qualified", "closed", "spam"].map((s) => (
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

        {/* Data table per DESIGN.md spec */}
        {loading ? (
          <div className="border-t-hairline border-gold pt-12 text-center text-body-md text-navy/55">Đang tải…</div>
        ) : leads.length === 0 ? (
          <div className="border-t-hairline border-gold pt-12 text-center text-body-md text-navy/55">Không có lead nào.</div>
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden md:table w-full text-body-sm">
              <thead>
                <tr className="border-b-hairline border-gold">
                  <th className="px-4 py-3 text-left text-label-caps uppercase text-navy">Họ tên</th>
                  <th className="px-4 py-3 text-left text-label-caps uppercase text-navy">Liên hệ</th>
                  <th className="px-4 py-3 text-left text-label-caps uppercase text-navy">Công ty</th>
                  <th className="px-4 py-3 text-left text-label-caps uppercase text-navy">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-label-caps uppercase text-navy">Ngày</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr
                    key={l.id}
                    onClick={() => setSelected(l)}
                    className="border-b border-data-row hover:bg-cream-100 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-4 font-medium text-navy">{l.full_name}</td>
                    <td className="px-4 py-4 text-navy/75">
                      <div className="flex items-center gap-1.5">
                        <Mail className="size-3.5 text-navy/45" />
                        {l.email}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] tracking-[0.05em]">
                        <Phone className="size-3 text-navy/45" />
                        {l.phone}
                      </div>
                      <div className="mt-1 text-[11px] tracking-[0.05em] text-navy/50 uppercase">
                        {MEETING_LABELS[l.meeting_type ?? "online"]}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-navy/75">{l.company ?? "—"}</td>
                    <td className="px-4 py-4">
                      <span className={cn("inline-block border-l-2 pl-2 text-label-caps uppercase", STATUS_COLORS[l.status] ?? "")}>
                        {STATUS_LABELS[l.status] ?? l.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-navy/60 text-[11px] tracking-[0.05em]">
                      {formatDate(l.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile list */}
            <ul className="md:hidden">
              {leads.map((l) => (
                <li
                  key={l.id}
                  onClick={() => setSelected(l)}
                  className="border-t-hairline border-gold/40 py-4 hover:bg-cream-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-navy truncate">
                        {l.full_name}
                      </p>
                      <p className="text-[11px] tracking-[0.05em] text-navy/65 mt-1">
                        {l.email} · {l.phone}
                      </p>
                      <p className="text-[11px] tracking-[0.05em] text-navy/50 mt-0.5 uppercase">
                        {MEETING_LABELS[l.meeting_type ?? "online"]}
                      </p>
                      {l.company && (
                        <p className="text-[11px] tracking-[0.05em] text-navy/55 mt-0.5">
                          <Building2 className="inline size-3 mr-1" />
                          {l.company}
                        </p>
                      )}
                    </div>
                    <span className={cn("shrink-0 border-l-2 pl-2 text-label-caps uppercase", STATUS_COLORS[l.status] ?? "")}>
                      {STATUS_LABELS[l.status] ?? l.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
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
          onMeetingChange={(body) => {
            void patchLead(selected.id, body);
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
  onMeetingChange,
}: {
  lead: Lead;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  onNotesChange: (notes: string) => void;
  onMeetingChange: (body: LeadPatch) => void;
}) {
  const [notes, setNotes] = useState(lead.internal_notes ?? "");
  const [meetingType, setMeetingType] = useState<"online" | "offline">(
    lead.meeting_type ?? "online",
  );
  const [meetingLink, setMeetingLink] = useState(lead.meeting_link ?? "");

  useEffect(() => {
    setNotes(lead.internal_notes ?? "");
    setMeetingType(lead.meeting_type ?? "online");
    setMeetingLink(lead.meeting_link ?? "");
  }, [lead]);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-navy/40" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-lg bg-cream border-l-hairline border-gold flex flex-col">
        <header className="px-7 py-6 border-b-hairline border-gold flex items-start justify-between gap-3">
          <div>
            <Eyebrow color="gold">Lead Detail</Eyebrow>
            <h2 className="text-headline-sm font-heading text-navy mt-3">{lead.full_name}</h2>
            <p className="text-body-sm text-navy/65 mt-2">{formatDate(lead.created_at)}</p>
          </div>
          <button onClick={onClose} aria-label="Đóng" className="p-2 -m-2 text-navy hover:text-gold-700 transition-colors">
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-7 space-y-6">
          <Field label="Email">
            <a href={`mailto:${lead.email}`} className="text-navy underline decoration-gold underline-offset-4 hover:text-gold-700 transition-colors">
              {lead.email}
            </a>
          </Field>
          <Field label="SĐT">
            <a href={`tel:${lead.phone}`} className="text-navy underline decoration-gold underline-offset-4 hover:text-gold-700 transition-colors">
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
              <p className="whitespace-pre-wrap text-body-md">{lead.message}</p>
            </Field>
          )}

          <div>
            <label className="block text-label-caps uppercase text-navy/70 mb-3">
              Trạng thái
            </label>
            <div className="relative">
              <select
                value={lead.status}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full appearance-none border-b border-navy bg-transparent px-0 py-2 pr-10 text-body-md font-medium focus:border-gold focus:outline-none transition-colors"
              >
                <option value="new">Mới</option>
                <option value="contacted">Đã liên hệ</option>
                <option value="qualified">Tiềm năng</option>
                <option value="closed">Đã đóng</option>
                <option value="spam">Spam</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 size-4 pointer-events-none text-gold" />
            </div>
          </div>

          <div className="border-t-hairline border-gold/40 pt-6">
            <label className="block text-label-caps uppercase text-navy/70 mb-3">
              Thong tin follow-up
            </label>
            <div className="relative">
              <select
                value={meetingType}
                onChange={(e) => {
                  const value = e.target.value as "online" | "offline";
                  setMeetingType(value);
                  if (value === "offline") setMeetingLink("");
                  onMeetingChange({
                    meeting_type: value,
                    meeting_link: value === "offline" ? null : meetingLink,
                  });
                }}
                className="w-full appearance-none border-b border-navy bg-transparent px-0 py-2 pr-10 text-body-md font-medium focus:border-gold focus:outline-none transition-colors"
              >
                <option value="online">Online</option>
                <option value="offline">Trao doi truc tiep</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 size-4 pointer-events-none text-gold" />
            </div>

            {meetingType === "online" ? (
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                onBlur={() => onMeetingChange({ meeting_link: meetingLink })}
                className="mt-4 w-full border-b border-navy bg-transparent px-0 py-2 text-body-md focus:border-gold focus:outline-none transition-colors"
                placeholder="Link hop online"
              />
            ) : (
              <p className="mt-4 text-body-sm text-navy/65">
                Lead nay se duoc follow-up theo hinh thuc trao doi truc tiep.
              </p>
            )}
          </div>

          <div>
            <label className="block text-label-caps uppercase text-navy/70 mb-3">
              Ghi chú nội bộ
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => onNotesChange(notes)}
              rows={4}
              className="w-full border-b border-navy bg-transparent px-0 py-2 text-body-md focus:border-gold focus:outline-none transition-colors"
              placeholder="Note follow-up, đánh giá..."
            />
            <p className="text-[11px] tracking-[0.05em] text-navy/45 mt-2">Lưu tự động khi click ra ngoài.</p>
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
      <p className="text-label-caps uppercase text-navy/55 mb-2">
        {label}
      </p>
      <div className="text-body-md text-navy">{children}</div>
    </div>
  );
}
