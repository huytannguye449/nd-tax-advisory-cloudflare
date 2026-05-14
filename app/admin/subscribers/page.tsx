"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/shared/button";
import { Eyebrow } from "@/components/shared/eyebrow";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Subscriber {
  id: string;
  email: string;
  source: string | null;
  status: string;
  subscribed_at: string;
}

export default function AdminSubscribersPage() {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/subscribers", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setSubs(data.subscribers);
        setLoading(false);
      });
  }, []);

  function exportCsv() {
    const rows = [
      ["Email", "Nguồn", "Trạng thái", "Ngày đăng ký"],
      ...subs.map((s) => [
        s.email,
        s.source ?? "",
        s.status,
        new Date(s.subscribed_at).toLocaleString("vi-VN"),
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
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const active = subs.filter((s) => s.status === "active").length;

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b-hairline border-gold pb-6">
          <div>
            <Eyebrow color="gold">Newsletter</Eyebrow>
            <h1 className="text-headline-lg font-heading text-navy mt-4">Subscribers</h1>
            <p className="text-body-md text-navy/65 mt-2">
              {active} active · {subs.length} tổng
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={!subs.length}>
            Xuất CSV
          </Button>
        </div>

        {loading ? (
          <div className="border-t-hairline border-gold pt-12 text-center text-body-md text-navy/55">Đang tải…</div>
        ) : subs.length === 0 ? (
          <div className="border-t-hairline border-gold pt-12 text-center text-body-md text-navy/55">Chưa có subscriber.</div>
        ) : (
          <table className="w-full text-body-sm">
            <thead>
              <tr className="border-b-hairline border-gold">
                <th className="px-4 py-3 text-left text-label-caps uppercase text-navy">Email</th>
                <th className="px-4 py-3 text-left text-label-caps uppercase text-navy">Nguồn</th>
                <th className="px-4 py-3 text-left text-label-caps uppercase text-navy">Trạng thái</th>
                <th className="px-4 py-3 text-left text-label-caps uppercase text-navy">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id} className="border-b border-data-row hover:bg-cream-100 transition-colors">
                  <td className="px-4 py-4 text-navy">{s.email}</td>
                  <td className="px-4 py-4 text-navy/65">{s.source ?? "—"}</td>
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "inline-block border-l-2 pl-2 text-label-caps uppercase",
                        s.status === "active"
                          ? "border-l-green-600 text-green-700"
                          : s.status === "pending"
                            ? "border-l-gold text-gold-700"
                            : "border-l-navy/30 text-navy/60",
                      )}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-navy/60 text-[11px] tracking-[0.05em]">
                    {formatDate(s.subscribed_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
