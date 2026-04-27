"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Users2,
  Calendar,
  Mail,
  FileText,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";

interface Stats {
  leads_30d: number;
  leads_new: number;
  bookings_pending: number;
  bookings_30d: number;
  subs_active: number;
  posts_published: number;
  posts_draft: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setStats(data.stats);
      });
  }, []);

  return (
    <AdminShell>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy">
            Tổng quan
          </h1>
          <p className="text-navy/60 mt-1">Số liệu 30 ngày gần nhất</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users2}
            label="Lead 30 ngày"
            value={stats?.leads_30d ?? "…"}
            sub={stats ? `${stats.leads_new} chưa xử lý` : ""}
            href="/admin/leads"
            highlight={stats ? stats.leads_new > 0 : false}
          />
          <StatCard
            icon={Calendar}
            label="Lịch hẹn 30 ngày"
            value={stats?.bookings_30d ?? "…"}
            sub={stats ? `${stats.bookings_pending} chờ confirm` : ""}
            href="/admin/bookings"
            highlight={stats ? stats.bookings_pending > 0 : false}
          />
          <StatCard
            icon={Mail}
            label="Newsletter"
            value={stats?.subs_active ?? "…"}
            sub="đang active"
            href="/admin/subscribers"
          />
          <StatCard
            icon={FileText}
            label="Bài viết"
            value={stats?.posts_published ?? "…"}
            sub={stats ? `${stats.posts_draft} draft` : ""}
            href="/admin/posts"
          />
        </div>

        <div className="bg-white rounded-2xl border border-cream-300 p-6 md:p-8">
          <h2 className="font-heading text-xl font-bold text-navy mb-4">
            Lối tắt
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <QuickLink href="/admin/posts/new" label="Viết bài mới" icon={FileText} />
            <QuickLink href="/admin/leads?status=new" label="Lead chưa xử lý" icon={Users2} />
            <QuickLink href="/admin/bookings?status=pending" label="Lịch chờ confirm" icon={Calendar} />
          </div>
        </div>

        {stats && stats.leads_new > 5 && (
          <div className="rounded-xl bg-gold/10 border border-gold/30 p-4 flex items-start gap-3">
            <AlertTriangle className="size-5 text-gold-700 mt-0.5 shrink-0" aria-hidden />
            <div>
              <p className="font-semibold text-navy">
                Bạn có {stats.leads_new} lead chưa phản hồi
              </p>
              <p className="text-sm text-navy/70 mt-1">
                Khuyến nghị phản hồi trong 4 giờ làm việc đầu tiên để giữ tỷ lệ chuyển đổi cao.
              </p>
              <Link
                href="/admin/leads?status=new"
                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-gold-700 hover:text-gold"
              >
                Xem ngay <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  href,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group bg-white rounded-xl border p-5 transition hover:shadow-md ${
        highlight ? "border-gold-300" : "border-cream-300"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className={`size-5 ${highlight ? "text-gold-700" : "text-navy/50"}`} aria-hidden />
        <ArrowRight className="size-4 text-navy/30 group-hover:text-gold-700 transition" aria-hidden />
      </div>
      <p className="text-xs text-navy/60 uppercase tracking-wider">{label}</p>
      <p className="font-heading text-3xl font-bold text-navy mt-1">{value}</p>
      {sub && <p className="text-xs text-navy/50 mt-1">{sub}</p>}
    </Link>
  );
}

function QuickLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-4 rounded-lg border border-cream-300 hover:border-gold/50 hover:bg-cream-50 transition min-h-[60px]"
    >
      <span className="size-10 rounded-md bg-cream-100 flex items-center justify-center shrink-0">
        <Icon className="size-4 text-gold-700" aria-hidden />
      </span>
      <span className="font-medium text-navy text-sm flex-1">{label}</span>
      <ArrowRight className="size-4 text-navy/40" aria-hidden />
    </Link>
  );
}
