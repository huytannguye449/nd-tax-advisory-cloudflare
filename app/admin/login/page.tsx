"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/shared/button";
import { Eyebrow } from "@/components/shared/eyebrow";

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
    <div className="min-h-screen bg-cream flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <Logo variant="primary" size="lg" />
          <p className="mt-5"><Eyebrow color="navy">Khu vực quản trị</Eyebrow></p>
        </div>

        {/* Form panel — flat with gold hairline top */}
        <div className="border-t-hairline border-gold pt-10">
          <h1 className="text-headline-sm font-heading text-navy mb-10">Đăng nhập</h1>

          <form onSubmit={onSubmit} className="space-y-7">
            <div>
              <label className="block text-label-caps uppercase text-navy/70 mb-3">
                Tài khoản
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className="w-full border-b border-navy bg-transparent px-0 py-2 text-body-md text-navy focus:border-gold focus:outline-none transition-colors min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-label-caps uppercase text-navy/70 mb-3">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full border-b border-navy bg-transparent px-0 py-2 text-body-md text-navy focus:border-gold focus:outline-none transition-colors min-h-[44px]"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 border-l-2 border-red-500 bg-red-50 p-3 text-body-sm text-red-800">
                <AlertCircle className="size-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" size="lg" fullWidth disabled={submitting}>
              {submitting ? "Đang đăng nhập…" : "Đăng nhập"}
            </Button>
          </form>

          <p className="text-[11px] tracking-[0.05em] text-navy/45 text-center mt-8">
            Khu vực dành cho quản trị viên NHN&D Tax Advisory
          </p>
        </div>
      </div>
    </div>
  );
}
