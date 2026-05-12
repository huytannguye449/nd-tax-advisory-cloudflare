"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, User as UserIcon, AlertCircle } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/shared/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Đăng nhập thất bại");
      }
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Logo variant="primary" size="lg" />
          <p className="mt-4 text-sm text-navy/60">Khu vực quản trị</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white rounded-2xl border border-cream-300 shadow-sm p-8 space-y-5"
        >
          <h1 className="text-2xl font-bold text-navy text-center">Đăng nhập</h1>

          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">
              Tài khoản
            </label>
            <div className="relative">
              <UserIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-navy/40"
                aria-hidden
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className="w-full rounded-md border border-cream-300 bg-white pl-10 pr-4 py-3 text-base focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 min-h-[48px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-navy/40"
                aria-hidden
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full rounded-md border border-cream-300 bg-white pl-10 pr-4 py-3 text-base focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 min-h-[48px]"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
              <AlertCircle className="size-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" size="lg" fullWidth disabled={submitting}>
            {submitting ? "Đang đăng nhập…" : "Đăng nhập"}
          </Button>

          <p className="text-xs text-navy/40 text-center pt-2">
            Khu vực dành cho quản trị viên NHN&D Tax Advisory
          </p>
        </form>
      </div>
    </div>
  );
}
