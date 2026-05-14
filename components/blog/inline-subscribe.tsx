"use client";

import { useState } from "react";
import { Button } from "@/components/shared/button";
import { BookOpen } from "lucide-react";
import { Eyebrow } from "@/components/shared/eyebrow";

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
      <div className="border-t-hairline border-gold pt-6 text-center">
        <BookOpen className="mx-auto mb-3 size-8 text-gold" aria-hidden="true" />
        <p className="text-body-md font-semibold text-navy">{msg}</p>
      </div>
    );
  }

  return (
    /* Navy callout block — sharp, no rounded */
    <div className="bg-navy text-cream p-6 md:p-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <BookOpen className="shrink-0 size-8 text-gold" aria-hidden="true" />
        <div className="flex-1">
          <Eyebrow color="cream" className="mb-1">Newsletter</Eyebrow>
          <h3 className="font-heading text-headline-sm text-cream">
            Nhận insights thuế hàng tuần
          </h3>
          <p className="mt-1 text-body-sm text-cream/60">
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
        {/* Cream input — bottom-border only style */}
        <input
          id="inline-subscribe-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@congty.vn"
          disabled={status === "loading"}
          className="flex-1 bg-transparent border-b border-cream/30 px-0 py-2.5 text-body-sm text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold disabled:opacity-60 min-h-[44px]"
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
        <p role="alert" className="mt-2 text-body-sm text-red-400">
          {msg}
        </p>
      )}
    </div>
  );
}
