"use client";

import { useState } from "react";
import { Button } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";

export function HomeSubscribe() {
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
        body: JSON.stringify({ email, source: "home" }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Có lỗi xảy ra");
      setStatus("success");
      setMsg("Cảm ơn bạn — vui lòng kiểm tra email để xác nhận.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }

  return (
    <Section bg="navy" spacing="md">
      <Container size="sm">
        <div className="flex flex-col items-center gap-6 text-center">
          <Eyebrow color="cream">Newsletter</Eyebrow>
          <h2 className="text-3xl font-bold text-cream md:text-4xl">
            Insights thuế hàng tuần cho founder
          </h2>
          <p className="text-base leading-relaxed text-cream/70 max-w-lg">
            Mỗi tuần một bài viết về thuế chiến lược, cập nhật chính sách, và case study thực tế. Miễn phí, hủy bất cứ lúc nào.
          </p>

          <form
            onSubmit={onSubmit}
            className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
            noValidate
            aria-label="Đăng ký nhận newsletter"
          >
            <label htmlFor="subscribe-email" className="sr-only">
              Địa chỉ email
            </label>
            <input
              id="subscribe-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@congty.vn"
              disabled={status === "loading" || status === "success"}
              className="flex-1 rounded-md border border-navy-300/40 bg-white/10 px-4 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy disabled:opacity-60 min-h-[44px]"
              autoComplete="email"
            />
            <Button
              type="submit"
              variant="secondary"
              size="md"
              disabled={status === "loading" || status === "success"}
            >
              {status === "loading" ? "Đang gửi…" : status === "success" ? "Đã đăng ký" : "Đăng ký"}
            </Button>
          </form>

          {msg && (
            <p
              role="alert"
              className={
                status === "success" ? "text-gold text-sm" : "text-red-300 text-sm"
              }
            >
              {msg}
            </p>
          )}
        </div>
      </Container>
    </Section>
  );
}
