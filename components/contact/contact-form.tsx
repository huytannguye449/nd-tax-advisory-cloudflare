"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { leadSchema, type LeadInput } from "@/lib/validators";
import { Button } from "@/components/shared/button";
import { Turnstile } from "@/components/shared/turnstile";
import { SERVICES } from "@/lib/data";
import { cn } from "@/lib/utils";

const COMPANY_SIZES = [
  { value: "<10", label: "Dưới 10 nhân sự" },
  { value: "10-50", label: "10 - 50 nhân sự" },
  { value: "50-200", label: "50 - 200 nhân sự" },
  { value: ">200", label: "Trên 200 nhân sự" },
];

export function ContactForm({ source = "lien-he" }: { source?: string }) {
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      services: [],
      consent: false as never,
      turnstileToken: "",
    },
  });

  const onSubmit = async (data: LeadInput) => {
    setSubmitState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, turnstileToken, source }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Có lỗi xảy ra");
      setSubmitState("success");
      reset();
    } catch (err) {
      setSubmitState("error");
      setErrorMsg(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  };

  if (submitState === "success") {
    return (
      <div className="border-t-hairline border-gold pt-8 text-center">
        <CheckCircle2 className="mx-auto size-12 text-gold-700" aria-hidden />
        <h3 className="mt-4 font-heading text-headline-sm text-navy">Cảm ơn bạn đã liên hệ</h3>
        <p className="mt-3 text-body-md text-navy/80 max-w-md mx-auto leading-relaxed">
          Chúng tôi đã nhận được yêu cầu của bạn và sẽ phản hồi qua email trong vòng 4 giờ
          làm việc. Vui lòng kiểm tra hộp thư.
        </p>
        <Button
          className="mt-6"
          variant="outline"
          onClick={() => setSubmitState("idle")}
        >
          Gửi yêu cầu khác
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Field label="Họ và tên" required error={errors.full_name?.message}>
        <input
          {...register("full_name")}
          type="text"
          autoComplete="name"
          className={inputCls}
          placeholder="Nguyễn Văn A"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Email" required error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            className={inputCls}
            placeholder="email@congty.vn"
          />
        </Field>
        <Field label="Số điện thoại" required error={errors.phone?.message}>
          <input
            {...register("phone")}
            type="tel"
            autoComplete="tel"
            className={inputCls}
            placeholder="0901 234 567"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Tên công ty">
          <input
            {...register("company")}
            type="text"
            autoComplete="organization"
            className={inputCls}
            placeholder="Công ty TNHH ABC"
          />
        </Field>
        <Field label="Quy mô doanh nghiệp">
          <select {...register("company_size")} className={inputCls}>
            <option value="">Chọn quy mô</option>
            {COMPANY_SIZES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Dịch vụ quan tâm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {SERVICES.map((s) => (
            <label
              key={s.slug}
              className="flex items-start gap-3 border-t border-cream-300 pt-3 cursor-pointer hover:border-gold transition"
            >
              <input
                type="checkbox"
                value={s.title}
                {...register("services")}
                className="mt-0.5 size-4 accent-navy"
              />
              <span className="text-body-sm text-navy">{s.title}</span>
            </label>
          ))}
        </div>
      </Field>

      <Field label="Mô tả nhu cầu" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={5}
          className={inputCls}
          placeholder="Vui lòng mô tả tình huống / câu hỏi cụ thể của doanh nghiệp..."
        />
      </Field>

      <label className="flex items-start gap-3 text-body-sm text-navy/80 cursor-pointer">
        <input
          type="checkbox"
          {...register("consent")}
          className="mt-0.5 size-4 accent-navy"
        />
        <span>
          Tôi đồng ý với{" "}
          <a href="/dieu-khoan" className="text-gold-700 underline">
            Điều khoản
          </a>{" "}
          và{" "}
          <a href="/chinh-sach-bao-mat" className="text-gold-700 underline">
            Chính sách bảo mật
          </a>
          .
        </span>
      </label>
      {errors.consent && (
        <p className="text-body-sm text-red-600">{errors.consent.message}</p>
      )}

      <Turnstile onToken={setTurnstileToken} />

      {submitState === "error" && (
        <div className="flex items-start gap-2 border border-red-200 bg-red-50 p-3 text-body-sm text-red-800">
          <AlertCircle className="size-4 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        fullWidth
        disabled={submitState === "loading" || !turnstileToken}
      >
        {submitState === "loading" ? "Đang gửi…" : "Gửi yêu cầu tư vấn"}
      </Button>
    </form>
  );
}

// Bottom-border only input — DESIGN.md pattern
const inputCls =
  "w-full bg-transparent border-0 border-b border-navy text-body-md text-navy placeholder:text-navy/40 py-3 px-0 focus:outline-none focus:border-gold transition-colors duration-150 min-h-[48px]";

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-label-caps text-navy/70 uppercase tracking-[0.1em] mb-2">
        {label}
        {required && <span className="text-gold ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className={cn("mt-1 text-body-sm text-red-600 flex items-center gap-1")}>
          <AlertCircle className="size-3.5" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}
