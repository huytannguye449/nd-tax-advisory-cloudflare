"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Send,
  Video,
} from "lucide-react";
import { leadSchema, type LeadInput } from "@/lib/validators";
import { Button } from "@/components/shared/button";
import { Turnstile } from "@/components/shared/turnstile";
import { cn } from "@/lib/utils";

const COMPANY_SIZES = [
  { value: "<10", label: "Dưới 10 nhân sự" },
  { value: "10-50", label: "10 - 50 nhân sự" },
  { value: "50-200", label: "50 - 200 nhân sự" },
  { value: ">200", label: "Trên 200 nhân sự" },
];

type LeadFormInput = Omit<LeadInput, "turnstileToken">;

function normalizePhone(phone: string) {
  return phone.trim().replace(/[\s.-]/g, "");
}

export function ContactForm({ source = "lien-he" }: { source?: string }) {
  const [meetingMode, setMeetingMode] = useState<"online" | "offline">(
    "online",
  );
  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormInput>({
    resolver: zodResolver(leadSchema.omit({ turnstileToken: true })),
    defaultValues: {
      services: [],
      meeting_type: "online",
      meeting_link: "",
      consent: false as never,
      source,
    },
  });

  const onSubmit = async (data: LeadFormInput) => {
    setFormError("");

    if (!turnstileToken) {
      setSubmitState("error");
      setFormError("Vui lòng xác nhận bảo mật trước khi gửi.");
      return;
    }

    setSubmitState("loading");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          phone: normalizePhone(data.phone),
          meeting_type: meetingMode,
          meeting_link: null,
          source,
          turnstileToken,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Không thể gửi yêu cầu liên hệ.");
      }

      setSubmitState("success");
      reset();
      setMeetingMode("online");
      setTurnstileToken("");
    } catch (error) {
      setSubmitState("error");
      setFormError(
        error instanceof Error
          ? error.message
          : "Không thể gửi biểu mẫu. Vui lòng thử lại.",
      );
    }
  };

  if (submitState === "success") {
    return (
      <div className="border border-cream-300 bg-cream-50 px-6 py-10 text-center shadow-sm sm:px-10">
        <CheckCircle2 className="mx-auto size-12 text-gold-700" aria-hidden />
        <p className="mt-5 text-label-caps uppercase text-gold-700">
          Yêu cầu đã được ghi nhận
        </p>
        <h3 className="mt-3 font-heading text-headline-sm text-navy">
          Cảm ơn bạn đã liên hệ
        </h3>
        <p className="mx-auto mt-3 max-w-md text-body-md leading-relaxed text-navy/70">
          Cảm ơn bạn. Đội ngũ NHN&D sẽ xem xét thông tin và phản hồi trong
          thời gian sớm nhất.
        </p>
        <Button
          className="mt-7"
          variant="outline"
          onClick={() => {
            setSubmitState("idle");
            setFormError("");
          }}
        >
          Gửi yêu cầu khác
        </Button>
      </div>
    );
  }

  return (
    <div className="border border-cream-300 bg-cream-50 p-6 shadow-sm md:p-10">
      <h3 className="mb-8 border-b border-cream-300 pb-4 font-heading text-headline-sm text-navy">
        Gửi yêu cầu tư vấn
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Họ và tên" error={errors.full_name?.message}>
            <input
              {...register("full_name")}
              type="text"
              autoComplete="name"
              className={inputCls}
              placeholder="Nguyễn Văn A"
            />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              className={inputCls}
              placeholder="email@congty.com"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Số điện thoại" error={errors.phone?.message}>
            <input
              {...register("phone", { setValueAs: normalizePhone })}
              type="tel"
              autoComplete="tel"
              className={inputCls}
              placeholder="+84 000 000 000"
            />
          </Field>
          <Field label="Tên công ty">
            <input
              {...register("company")}
              type="text"
              autoComplete="organization"
              className={inputCls}
              placeholder="Tên doanh nghiệp của bạn"
            />
          </Field>
        </div>

        <Field label="Quy mô doanh nghiệp">
          <select {...register("company_size")} className={inputCls}>
            <option value="">Chọn quy mô doanh nghiệp</option>
            {COMPANY_SIZES.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </Field>

        <div className="border-t border-cream-300 pt-4">
          <p className="mb-4 text-label-caps uppercase tracking-[0.12em] text-navy/60">
            Hình thức làm việc (Meeting Mode)
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <MeetingModeCard
              checked={meetingMode === "online"}
              icon={<Video className="size-5" aria-hidden />}
              title="Trực tuyến (Online)"
              description="Zoom, Meet hoặc Teams"
              onChange={() => setMeetingMode("online")}
            />
            <MeetingModeCard
              checked={meetingMode === "offline"}
              icon={<Building2 className="size-5" aria-hidden />}
              title="Trực tiếp (Offline)"
              description="Tại NHN hoặc văn phòng đối tác"
              onChange={() => setMeetingMode("offline")}
            />
          </div>
        </div>

        <Field label="Mô tả nhu cầu" error={errors.message?.message}>
          <textarea
            {...register("message")}
            rows={3}
            className={cn(inputCls, "min-h-24 resize-none leading-relaxed")}
            placeholder="Vui lòng cho chúng tôi biết thêm về yêu cầu cụ thể của bạn..."
          />
        </Field>

        <div className="pt-2">
          <label className="mb-6 flex cursor-pointer items-start gap-3 text-body-md text-navy/70">
            <input
              type="checkbox"
              {...register("consent")}
              className="mt-0.5 size-5 border-cream-300 accent-gold"
            />
            <span>
              Tôi đồng ý với{" "}
              <a href="/dieu-khoan" className="text-gold-700 hover:underline">
                Điều khoản
              </a>{" "}
              và{" "}
              <a
                href="/chinh-sach-bao-mat"
                className="text-gold-700 hover:underline"
              >
                Chính sách bảo mật
              </a>
            </span>
          </label>
          {errors.consent && (
            <ErrorText message={errors.consent.message} className="mb-4" />
          )}

          <Turnstile
            onToken={setTurnstileToken}
            className="mb-4 min-h-[65px]"
          />

          {submitState === "error" && formError && (
            <div className="mb-4 flex items-start gap-2 border border-red-200 bg-red-50 p-3 text-body-sm text-red-800">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto"
            disabled={submitState === "loading"}
          >
            {submitState === "loading" ? (
              "Đang ghi nhận..."
            ) : (
              <>
                Gửi yêu cầu
                <Send className="size-4" aria-hidden />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "w-full border-0 border-b border-cream-300 bg-transparent px-0 py-2 text-body-md text-navy outline-none transition-colors placeholder:text-navy/35 focus:border-gold";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="group flex flex-col gap-2">
      <label className="text-label-caps uppercase tracking-[0.12em] text-navy/60 transition-colors group-focus-within:text-gold-700">
        {label}
      </label>
      {children}
      {error && <ErrorText message={error} />}
    </div>
  );
}

function MeetingModeCard({
  checked,
  icon,
  title,
  description,
  onChange,
}: {
  checked: boolean;
  icon: ReactNode;
  title: string;
  description: string;
  onChange: () => void;
}) {
  return (
    <label className="group relative cursor-pointer">
      <input
        checked={checked}
        className="peer sr-only"
        name="contact_meeting_mode"
        type="radio"
        onChange={onChange}
      />
      <span className="flex h-full items-center gap-4 border border-cream-300 p-4 transition-colors group-hover:border-gold peer-checked:border-gold peer-checked:bg-cream">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center text-navy transition-colors",
            checked ? "bg-gold" : "bg-cream-200",
          )}
        >
          {icon}
        </span>
        <span>
          <span className="block text-xs font-bold uppercase tracking-[0.12em] text-navy">
            {title}
          </span>
          <span className="mt-1 block text-[13px] leading-tight text-navy/55">
            {description}
          </span>
        </span>
      </span>
    </label>
  );
}

function ErrorText({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  if (!message) return null;
  return (
    <p className={cn("flex items-center gap-1 text-body-sm text-red-600", className)}>
      <AlertCircle className="size-3.5" aria-hidden />
      {message}
    </p>
  );
}
