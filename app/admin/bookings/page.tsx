"use client";

import { useEffect, useState } from "react";
import { Calendar, Video, Building2, Mail, Phone } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/shared/button";

interface Booking {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company: string | null;
  service: string | null;
  scheduled_at: string;
  duration_min: number;
  meeting_type: string;
  meeting_link: string | null;
  status: string;
  message: string | null;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ confirm",
  confirmed: "Đã confirm",
  rescheduled: "Đã đổi lịch",
  cancelled: "Đã hủy",
  completed: "Đã xong",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gold/15 text-gold-700",
  confirmed: "bg-green-50 text-green-700",
  rescheduled: "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-700",
  completed: "bg-cream-200 text-navy/60",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editLinkId, setEditLinkId] = useState<string | null>(null);
  const [linkValue, setLinkValue] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/bookings?status=${filter}`, {
      credentials: "include",
    });
    const data = await res.json();
    if (data.ok) setBookings(data.bookings);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, [filter]);

  async function patch(id: string, body: Record<string, unknown>) {
    await fetch("/api/admin/bookings", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });
    void load();
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy">Lịch hẹn</h1>
          <p className="text-navy/60 mt-1">{bookings.length} bản ghi</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
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
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-cream-300 p-12 text-center text-navy/50">
            Không có lịch hẹn nào.
          </div>
        ) : (
          <ul className="space-y-3">
            {bookings.map((b) => {
              const date = new Date(b.scheduled_at);
              return (
                <li
                  key={b.id}
                  className="bg-white rounded-xl border border-cream-300 p-5 md:p-6"
                >
                  <div className="grid md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gold-700">
                        {date.toLocaleDateString("vi-VN", {
                          weekday: "short",
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </p>
                      <p className="font-heading text-2xl font-bold text-navy mt-1">
                        {date.toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-xs text-navy/50 mt-0.5">
                        {b.duration_min} phút · {b.meeting_type === "online" ? (
                          <span className="inline-flex items-center gap-1"><Video className="size-3" /> Online</span>
                        ) : (
                          <span className="inline-flex items-center gap-1"><Building2 className="size-3" /> Tại VP</span>
                        )}
                      </p>
                    </div>

                    <div className="md:col-span-5 space-y-1">
                      <p className="font-semibold text-navy">{b.full_name}</p>
                      <p className="text-sm text-navy/70 flex items-center gap-1.5">
                        <Mail className="size-3.5" /> {b.email}
                      </p>
                      <p className="text-sm text-navy/70 flex items-center gap-1.5">
                        <Phone className="size-3.5" /> {b.phone}
                      </p>
                      {b.company && (
                        <p className="text-sm text-navy/60">{b.company}</p>
                      )}
                      <p className="text-sm text-navy/65 mt-2">
                        <span className="font-semibold">Dịch vụ:</span> {b.service ?? "—"}
                      </p>
                      {b.message && (
                        <p className="text-xs text-navy/55 mt-1 italic">"{b.message}"</p>
                      )}
                    </div>

                    <div className="md:col-span-4 flex flex-col gap-2 items-start md:items-end">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          STATUS_COLORS[b.status] ?? ""
                        }`}
                      >
                        {STATUS_LABELS[b.status] ?? b.status}
                      </span>

                      {b.meeting_link && (
                        <a
                          href={b.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gold-700 underline truncate max-w-[200px]"
                        >
                          {b.meeting_link}
                        </a>
                      )}

                      <div className="flex flex-wrap gap-2 mt-1">
                        {b.status === "pending" && (
                          <>
                            <button
                              onClick={() => {
                                setEditLinkId(b.id);
                                setLinkValue(b.meeting_link ?? "");
                              }}
                              className="text-xs px-3 py-1.5 rounded-md bg-gold text-navy font-semibold hover:bg-gold-600"
                            >
                              Confirm + thêm link
                            </button>
                            <button
                              onClick={() => patch(b.id, { status: "cancelled" })}
                              className="text-xs px-3 py-1.5 rounded-md bg-red-50 text-red-700 hover:bg-red-100"
                            >
                              Hủy
                            </button>
                          </>
                        )}
                        {b.status === "confirmed" && date < new Date() && (
                          <button
                            onClick={() => patch(b.id, { status: "completed" })}
                            className="text-xs px-3 py-1.5 rounded-md bg-cream-200 text-navy hover:bg-cream-300"
                          >
                            Đánh dấu hoàn thành
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {editLinkId === b.id && (
                    <div className="mt-4 pt-4 border-t border-cream-200 flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        value={linkValue}
                        onChange={(e) => setLinkValue(e.target.value)}
                        placeholder="https://meet.google.com/..."
                        className="flex-1 rounded-md border border-cream-300 px-3 py-2 text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          patch(b.id, { status: "confirmed", meeting_link: linkValue });
                          setEditLinkId(null);
                        }}
                      >
                        Lưu
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditLinkId(null)}
                      >
                        Hủy
                      </Button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
