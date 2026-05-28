"use client";

import { useState, type FormEvent } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/shared/button";
import { Eyebrow } from "@/components/shared/eyebrow";
import { subscribeToNewsletter } from "@/components/marketing/newsletter-client";

export function InlineSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      await subscribeToNewsletter(email, "blog-inline");
      setStatus("success");
      setMsg("Cảm ơn bạn. Các ấn phẩm mới sẽ được gửi trực tiếp tới email của bạn.");
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
    <div className="bg-navy p-6 text-cream md:p-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <BookOpen className="size-8 shrink-0 text-gold" aria-hidden="true" />
        <div className="flex-1">
          <Eyebrow color="cream" className="mb-1">
            Newsletter
          </Eyebrow>
          <h3 className="font-heading text-headline-sm text-cream">
            Nhận insights thuế hằng tuần
          </h3>
          <p className="mt-1 text-body-sm text-cream/60">
            Cập nhật chính sách, case study và góc nhìn chuyên môn, miễn phí và
            có thể hủy bất cứ lúc nào.
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
          className="min-h-[44px] flex-1 border-b border-cream/30 bg-transparent px-0 py-2.5 text-body-sm text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none disabled:opacity-60"
          autoComplete="email"
        />
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          disabled={status === "loading"}
          className="shrink-0"
        >
          {status === "loading" ? "Đang gửi..." : "Đăng ký"}
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
