"use client";

import { useState } from "react";
import { Button } from "@/components/shared/button";
import { BookOpen } from "lucide-react";

export function InlineSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "blog-inline" }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Có lỗi xảy ra");
      setStatus("success");
      setMsg("Cảm ơn bạn — vui lòng kiểm tra email để xác nhận!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-gold/30 bg-gold-50 p-6 text-center">
        <BookOpen className="mx-auto mb-3 size-8 text-gold-600" aria-hidden="true" />
        <p className="font-semibold text-navy">{msg}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-cream-200 bg-cream-100 p-6 md:p-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <BookOpen className="shrink-0 size-8 text-gold-600" aria-hidden="true" />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-navy">
            Nhận insights thuế hàng tuần
          </h3>
          <p className="mt-1 text-sm text-navy/60">
            Cập nhật chính sách, case study, và mẹo tối ưu thuế — miễn phí, hủy bất cứ lúc nào.
          </p>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-5 flex flex-col gap-3 sm:flex-row"
        noValidate
        aria-label="Đăng ký nhận newsletter"
      >
        <label htmlFor="inline-subscribe-email" className="sr-only">
          Địa chỉ email
        </label>
        <input
          id="inline-subscribe-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@congty.vn"
          disabled={status === "loading"}
          className="flex-1 rounded-lg border border-cream-200 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent disabled:opacity-60 min-h-[44px]"
          autoComplete="email"
        />
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          disabled={status === "loading"}
          className="shrink-0"
        >
          {status === "loading" ? "Đang gửi…" : "Đăng ký"}
        </Button>
      </form>

      {status === "error" && msg && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {msg}
        </p>
      )}
    </div>
  );
}
