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
      <Container size="default">
        {/* Asymmetric layout: headline left, form right */}
        <div className="grid gap-[var(--spacing-gutter)] lg:grid-cols-2 lg:items-center">
          {/* Left — editorial header block */}
          <div className="flex flex-col gap-6">
            <Eyebrow color="cream">Bản tin chuyên môn</Eyebrow>
            <h2 className="font-heading text-headline-md text-cream text-balance">
              Insights thuế hàng tuần cho founder
            </h2>
            <p className="text-body-lg text-cream/70 max-w-md">
              Mỗi tuần một bài viết về thuế chiến lược, cập nhật chính sách, và case study thực tế. Miễn phí, hủy bất cứ lúc nào.
            </p>
          </div>

          {/* Right — minimalist form */}
          <div className="flex flex-col gap-5">
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-5"
              noValidate
              aria-label="Đăng ký nhận newsletter"
            >
              {/* Label-caps above input */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="subscribe-email"
                  className="text-label-caps text-cream/70 uppercase tracking-[0.1em]"
                >
                  Địa chỉ email
                </label>
                {/* Input — bottom-border only, cream→gold focus */}
                <input
                  id="subscribe-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@congty.vn"
                  disabled={status === "loading" || status === "success"}
                  className="
                    w-full bg-transparent border-0 border-b border-cream/40
                    text-cream placeholder:text-cream/30
                    py-3 px-0
                    focus:outline-none focus:border-gold
                    transition-colors duration-150
                    disabled:opacity-60
                    min-h-[44px]
                  "
                  autoComplete="email"
                />
              </div>

              {/* Submit — cream bg navy text, hover gold */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={status === "loading" || status === "success"}
                className="bg-cream text-navy border-cream hover:bg-gold hover:border-gold hover:text-navy self-start"
              >
                {status === "loading" ? "Đang gửi…" : status === "success" ? "Đã đăng ký" : "Đăng ký"}
              </Button>
            </form>

            {msg && (
              <p
                role="alert"
                className={
                  status === "success"
                    ? "text-label-caps text-gold uppercase tracking-[0.1em]"
                    : "text-body-sm text-red-300"
                }
              >
                {msg}
              </p>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
