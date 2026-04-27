"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/shared/button";
import { formatDate } from "@/lib/utils";

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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-navy">Newsletter</h1>
            <p className="text-navy/60 mt-1">
              {active} active · {subs.length} tổng
            </p>
          </div>
          <Button variant="outline" onClick={exportCsv} disabled={!subs.length}>
            Xuất CSV
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-cream-300 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-navy/50">Đang tải…</div>
          ) : subs.length === 0 ? (
            <div className="p-12 text-center text-navy/50">Chưa có subscriber.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-cream-100 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-navy">Email</th>
                  <th className="px-4 py-3 font-semibold text-navy">Nguồn</th>
                  <th className="px-4 py-3 font-semibold text-navy">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold text-navy">Ngày</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id} className="border-t border-cream-200">
                    <td className="px-4 py-3 text-navy">{s.email}</td>
                    <td className="px-4 py-3 text-navy/60">{s.source ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          s.status === "active"
                            ? "bg-green-50 text-green-700"
                            : s.status === "pending"
                              ? "bg-gold/15 text-gold-700"
                              : "bg-cream-200 text-navy/60"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-navy/60 text-xs">
                      {formatDate(s.subscribed_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
