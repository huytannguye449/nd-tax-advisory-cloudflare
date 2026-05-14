"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users2,
  Calendar,
  Mail,
  FileText,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Eyebrow } from "@/components/shared/eyebrow";

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
      <div className="space-y-12">
        {/* Page header */}
        <div className="border-b-hairline border-gold pb-8">
          <Eyebrow color="gold">Admin</Eyebrow>
          <h1 className="text-headline-lg font-heading text-navy mt-4">Tổng quan</h1>
          <p className="text-body-md text-navy/65 mt-2">Số liệu 30 ngày gần nhất</p>
        </div>

        {/* Stat tiles — flat, hairline-top, no card */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[var(--spacing-gutter)] gap-y-12">
          <StatTile
            label="Lead 30 ngày"
            value={stats?.leads_30d ?? "…"}
            sub={stats ? `${stats.leads_new} chưa xử lý` : ""}
            href="/admin/leads"
            highlight={stats ? stats.leads_new > 0 : false}
          />
          <StatTile
            label="Lịch hẹn 30 ngày"
            value={stats?.bookings_30d ?? "…"}
            sub={stats ? `${stats.bookings_pending} chờ confirm` : ""}
            href="/admin/bookings"
            highlight={stats ? stats.bookings_pending > 0 : false}
          />
          <StatTile
            label="Newsletter"
            value={stats?.subs_active ?? "…"}
            sub="đang active"
            href="/admin/subscribers"
          />
          <StatTile
            label="Bài viết"
            value={stats?.posts_published ?? "…"}
            sub={stats ? `${stats.posts_draft} draft` : ""}
            href="/admin/posts"
          />
        </div>

        {/* Quick links */}
        <div>
          <Eyebrow color="navy">Lối tắt</Eyebrow>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-[var(--spacing-gutter)]">
            <QuickLink href="/admin/posts/new" label="Viết bài mới" icon={FileText} />
            <QuickLink href="/admin/leads?status=new" label="Lead chưa xử lý" icon={Users2} />
            <QuickLink href="/admin/bookings?status=pending" label="Lịch chờ confirm" icon={Calendar} />
          </div>
        </div>

        {/* Alert banner — editorial callout */}
        {stats && stats.leads_new > 5 && (
          <div className="border-t-hairline border-gold bg-gold/5 p-6 flex items-start gap-4">
            <AlertTriangle className="size-5 text-gold mt-0.5 shrink-0" aria-hidden />
            <div>
              <p className="text-label-caps uppercase text-navy">
                {stats.leads_new} lead chưa phản hồi
              </p>
              <p className="text-body-md text-navy/75 mt-3">
                Khuyến nghị phản hồi trong 4 giờ làm việc đầu tiên để giữ tỷ lệ chuyển đổi cao.
              </p>
              <Link
                href="/admin/leads?status=new"
                className="mt-4 inline-flex items-center gap-1 text-label-caps uppercase text-gold hover:text-gold-700 transition-colors"
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

function StatTile({
  label,
  value,
  sub,
  href,
  highlight,
}: {
  label: string;
  value: string | number;
  sub?: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group border-t-hairline border-gold pt-6 block"
    >
      <p className={`text-label-caps uppercase mb-4 ${highlight ? "text-gold" : "text-navy/55"}`}>
        {label}
      </p>
      <p className="text-display font-heading text-navy leading-none">{value}</p>
      {sub && (
        <p className="text-[11px] tracking-[0.05em] text-navy/55 mt-3 flex items-center gap-1">
          {sub}
          <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </p>
      )}
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
      className="flex items-center gap-3 border-t-hairline border-gold pt-5 hover:text-gold transition-colors"
    >
      <Icon className="size-4 text-gold shrink-0" aria-hidden />
      <span className="text-label-caps uppercase text-navy flex-1">{label}</span>
      <ArrowRight className="size-4 text-navy/35" aria-hidden />
    </Link>
  );
}
