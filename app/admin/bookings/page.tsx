"use client";

import { useEffect, useState } from "react";
import { Video, Building2, Mail, Phone } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/shared/button";
import { Eyebrow } from "@/components/shared/eyebrow";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company: string | null;
  service: string | null;
  services: string[] | null;
  scheduled_at: string | null;
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
  cancelled: "Đã hủy",
  completed: "Đã xong",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "border-l-gold text-gold-700",
  confirmed: "border-l-green-600 text-green-700",
  cancelled: "border-l-red-500 text-red-700",
  completed: "border-l-navy/30 text-navy/60",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editLinkId, setEditLinkId] = useState<string | null>(null);
  const [linkValue, setLinkValue] = useState("");
  const [actionError, setActionError] = useState("");

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
    setActionError("");
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      setActionError(data.error || "Không cập nhật được booking.");
      return false;
    }
    void load();
    return true;
  }

  async function confirmBooking(booking: Booking) {
    if (booking.meeting_type === "online" && !linkValue.trim()) {
      setActionError("Booking online cần link họp trước khi xác nhận.");
      return;
    }

    const ok = await patch(booking.id, {
      status: "confirmed",
      meeting_link: booking.meeting_type === "online" ? linkValue : "",
    });
    if (ok) {
      setEditLinkId(null);
      setLinkValue("");
    }
  }

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="border-b-hairline border-gold pb-6">
          <Eyebrow color="gold">Bookings</Eyebrow>
          <h1 className="text-headline-lg font-heading text-navy mt-4">Lịch hẹn</h1>
          <p className="text-body-md text-navy/65 mt-2">{bookings.length} bản ghi</p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-0 border-b-hairline border-gold/30">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
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

        {loading ? (
          <div className="border-t-hairline border-gold pt-12 text-center text-body-md text-navy/55">Đang tải…</div>
        ) : bookings.length === 0 ? (
          <div className="border-t-hairline border-gold pt-12 text-center text-body-md text-navy/55">Không có lịch hẹn nào.</div>
        ) : (
          <ul>
            {bookings.map((b) => {
              const date = b.scheduled_at ? new Date(b.scheduled_at) : null;
              const hasValidSchedule = date ? !Number.isNaN(date.getTime()) : false;
              const serviceLabel =
                b.services?.length ? b.services.join(", ") : b.service ?? "—";
              return (
                <li
                  key={b.id}
                  className="border-t-hairline border-gold pt-6 pb-6"
                >
                  <div className="grid md:grid-cols-12 gap-[var(--spacing-gutter)] items-start">
                    <div className="md:col-span-3">
                      <Eyebrow color="gold">
                        {hasValidSchedule
                          ? date!.toLocaleDateString("vi-VN", {
                              weekday: "short",
                              day: "2-digit",
                              month: "2-digit",
                            })
                          : "Yêu cầu tư vấn"}
                      </Eyebrow>
                      <p className="font-heading text-headline-sm text-navy mt-3">
                        {hasValidSchedule
                          ? date!.toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Chưa xác nhận lịch"}
                      </p>
                      <p className="text-[11px] tracking-[0.05em] text-navy/55 mt-2">
                        {b.duration_min} phút · {b.meeting_type === "online" ? (
                          <span className="inline-flex items-center gap-1"><Video className="size-3" /> Online</span>
                        ) : (
                          <span className="inline-flex items-center gap-1"><Building2 className="size-3" /> Tại VP</span>
                        )}
                      </p>
                    </div>

                    <div className="md:col-span-5 space-y-2">
                      <p className="font-semibold text-navy">{b.full_name}</p>
                      <p className="text-body-sm text-navy/75 flex items-center gap-1.5">
                        <Mail className="size-3.5" /> {b.email}
                      </p>
                      <p className="text-body-sm text-navy/75 flex items-center gap-1.5">
                        <Phone className="size-3.5" /> {b.phone}
                      </p>
                      {b.company && (
                        <p className="text-body-sm text-navy/65">{b.company}</p>
                      )}
                      <p className="text-body-sm text-navy/70 mt-3">
                        <span className="text-label-caps uppercase text-navy/55 mr-2">Dịch vụ</span>{serviceLabel}
                      </p>
                      {b.message && (
                        <p className="text-body-sm text-navy/60 mt-2 italic">"{b.message}"</p>
                      )}
                    </div>

                    <div className="md:col-span-4 flex flex-col gap-3 items-start md:items-end">
                      {actionError && editLinkId === b.id && (
                        <p className="max-w-xs text-body-sm text-red-700">{actionError}</p>
                      )}
                      <span className={cn("border-l-2 pl-2 text-label-caps uppercase", STATUS_COLORS[b.status] ?? "")}>
                        {STATUS_LABELS[b.status] ?? b.status}
                      </span>

                      {b.meeting_link && (
                        <a
                          href={b.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-body-sm text-navy underline decoration-gold underline-offset-4 hover:text-gold-700 truncate max-w-[200px] transition-colors"
                        >
                          {b.meeting_link}
                        </a>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {b.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => {
                                setEditLinkId(b.id);
                                setLinkValue(b.meeting_link ?? "");
                                setActionError("");
                              }}
                            >
                              Xác nhận yêu cầu
                            </Button>
                            <button
                              onClick={() => patch(b.id, { status: "cancelled" })}
                              className="text-label-caps uppercase px-4 py-2.5 border border-red-300 text-red-700 hover:bg-red-50 transition-colors min-h-[44px]"
                            >
                              Hủy
                            </button>
                          </>
                        )}
                        {b.status === "confirmed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => patch(b.id, { status: "completed" })}
                          >
                            Đánh dấu hoàn thành
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {editLinkId === b.id && (
                    <div className="mt-5 pt-5 border-t-hairline border-gold/40 flex flex-col sm:flex-row gap-3">
                      {b.meeting_type === "online" ? (
                        <input
                          type="url"
                          value={linkValue}
                          onChange={(e) => setLinkValue(e.target.value)}
                          placeholder="Link họp online"
                          className="flex-1 border-b border-navy bg-transparent px-0 py-2 text-body-md focus:border-gold focus:outline-none transition-colors"
                        />
                      ) : (
                        <p className="flex-1 text-body-sm text-navy/65">
                          Yêu cầu trao đổi trực tiếp. Không cần link họp.
                        </p>
                      )}
                      <Button
                        size="sm"
                        onClick={() => confirmBooking(b)}
                      >
                        Xác nhận
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditLinkId(null);
                          setActionError("");
                        }}
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
