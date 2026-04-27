"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, AlertCircle, KeyRound } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/shared/button";

export default function AdminProfilePage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (next !== confirm) {
      setError("Mật khẩu mới không khớp");
      return;
    }
    if (next.length < 6) {
      setError("Mật khẩu mới tối thiểu 6 ký tự");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Lỗi");
      setSuccess(true);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminShell>
      <div className="max-w-xl space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy">Đổi mật khẩu</h1>
          <p className="text-navy/60 mt-1">
            Cập nhật mật khẩu đăng nhập admin
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white rounded-2xl border border-cream-300 p-6 md:p-8 space-y-5"
        >
          <Field
            label="Mật khẩu hiện tại"
            value={current}
            onChange={setCurrent}
            autoComplete="current-password"
          />
          <Field
            label="Mật khẩu mới"
            value={next}
            onChange={setNext}
            autoComplete="new-password"
            hint="Tối thiểu 6 ký tự. Khuyến nghị > 12 ký tự, có chữ + số + ký tự đặc biệt."
          />
          <Field
            label="Xác nhận mật khẩu mới"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
          />

          {error && (
            <div className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
              <AlertCircle className="size-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
              <CheckCircle2 className="size-4 mt-0.5 shrink-0" />
              <span>Đã đổi mật khẩu thành công.</span>
            </div>
          )}

          <Button type="submit" size="lg" fullWidth disabled={submitting}>
            <KeyRound className="size-4" />
            {submitting ? "Đang cập nhật…" : "Cập nhật mật khẩu"}
          </Button>
        </form>
      </div>
    </AdminShell>
  );
}

function Field({
  label,
  value,
  onChange,
  autoComplete,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy mb-1.5">{label}</label>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required
        className="w-full rounded-md border border-cream-300 bg-white px-4 py-3 text-base focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 min-h-[48px]"
      />
      {hint && <p className="text-xs text-navy/50 mt-1.5">{hint}</p>}
    </div>
  );
}
