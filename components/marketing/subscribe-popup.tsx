"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import {
  markNewsletterDismissed,
  shouldShowNewsletterPopup,
  subscribeToNewsletter,
} from "@/components/marketing/newsletter-client";

type Status = "idle" | "loading" | "success" | "error";

export function SubscribePopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!shouldShowNewsletterPopup()) return;

    let triggered = false;
    const trigger = () => {
      if (triggered || !shouldShowNewsletterPopup()) return;
      triggered = true;
      setVisible(true);
    };

    const timer = window.setTimeout(trigger, 25_000);
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = window.scrollY / scrollable;
      if (progress >= 0.45) trigger();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible]);

  function close() {
    markNewsletterDismissed();
    setVisible(false);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      await subscribeToNewsletter(email, "newsletter-popup");
      setStatus("success");
      setEmail("");
      setMessage(
        "Cảm ơn bạn đã đăng ký. Các ấn phẩm mới sẽ được gửi trực tiếp tới email của bạn.",
      );
      window.setTimeout(() => setVisible(false), 2800);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Không đăng ký được newsletter.",
      );
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-navy/35 px-4 py-4 backdrop-blur-[1px] sm:items-center sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-popup-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="relative w-full max-w-xl translate-y-0 border border-gold/40 bg-cream p-6 text-navy shadow-[0_24px_80px_rgba(15,43,70,0.22)] transition-all duration-200 sm:p-8">
        <button
          type="button"
          aria-label="Đóng popup newsletter"
          onClick={close}
          className="absolute right-4 top-4 inline-flex size-9 items-center justify-center text-navy/60 transition-colors hover:text-gold-700"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <p className="mb-4 text-label-caps uppercase text-gold-700">
          Newsletter
        </p>
        <h2
          id="newsletter-popup-title"
          className="max-w-md font-heading text-headline-sm leading-tight text-navy sm:text-headline-md"
        >
          Nhận cập nhật chuyên đề thuế &amp; quản trị
        </h2>
        <p className="mt-4 max-w-md text-body-md leading-relaxed text-navy/70">
          Nhận các phân tích và cập nhật mới nhất dành cho founder, CFO và đội
          ngũ tài chính. Cập nhật trực tiếp vào email của bạn.
        </p>

        {status === "success" ? (
          <p
            role="status"
            className="mt-7 border-t border-gold/40 pt-5 text-body-md font-medium text-navy"
          >
            {message}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-7 space-y-4" noValidate>
            <label className="block">
              <span className="sr-only">Email của bạn</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@congty.vn"
                autoComplete="email"
                disabled={status === "loading"}
                className="min-h-[48px] w-full border-0 border-b border-navy/35 bg-transparent px-0 py-3 text-body-md text-navy placeholder:text-navy/35 transition-colors focus:border-gold focus:outline-none disabled:opacity-60"
              />
            </label>
            <button
              type="submit"
              disabled={status === "loading"}
              className="min-h-[48px] w-full bg-navy px-5 py-3 text-label-caps uppercase text-cream transition-colors hover:bg-gold hover:text-navy disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {status === "loading" ? "Đang đăng ký..." : "Đăng ký nhận bản tin"}
            </button>
            {status === "error" && message && (
              <p role="alert" className="text-body-sm text-red-700">
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
