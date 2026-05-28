"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Edit3,
  MessageSquare,
  Network,
  UserRound,
  Video,
} from "lucide-react";
import { Button } from "@/components/shared/button";
import { Turnstile } from "@/components/shared/turnstile";
import { leadSchema } from "@/lib/validators";
import { cn } from "@/lib/utils";

interface ServiceOption {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
}

const bookingRequestSchema = leadSchema.pick({
  full_name: true,
  email: true,
  phone: true,
  company: true,
  message: true,
  consent: true,
});

type BookingRequestInput = z.infer<typeof bookingRequestSchema>;

function normalizePhone(phone: string) {
  return phone.trim().replace(/[\s.-]/g, "");
}

export function BookingForm() {
  const didAutoSelectServiceRef = useRef(false);
  const [meetingType, setMeetingType] = useState<"online" | "offline">(
    "online",
  );
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/services", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json.ok) setServices(json.services ?? []);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (didAutoSelectServiceRef.current || services.length === 0) return;
    didAutoSelectServiceRef.current = true;
    if (typeof window === "undefined") return;

    const serviceSlug = new URLSearchParams(window.location.search).get(
      "service",
    );
    if (!serviceSlug) return;

    const matchedService = services.find(
      (service) => service.slug === serviceSlug,
    );
    if (!matchedService) return;

    setSelectedServices((current) =>
      current.includes(matchedService.title)
        ? current
        : [...current, matchedService.title],
    );
  }, [services]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingRequestInput>({
    resolver: zodResolver(bookingRequestSchema),
    defaultValues: { consent: false as never },
  });

  const toggleService = (title: string) => {
    setSelectedServices((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title],
    );
  };

  const onSubmit = async (data: BookingRequestInput) => {
    setFormError("");

    if (selectedServices.length === 0) {
      setSubmitState("error");
      setFormError("Vui lòng chọn ít nhất một dịch vụ quan tâm.");
      return;
    }

    if (!turnstileToken) {
      setSubmitState("error");
      setFormError("Vui lòng xác nhận bảo mật trước khi gửi.");
      return;
    }

    setSubmitState("loading");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          phone: normalizePhone(data.phone),
          services: selectedServices,
          meeting_type: meetingType,
          turnstileToken,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Không thể gửi yêu cầu tư vấn.");
      }

      setSubmitState("success");
      reset();
      setSelectedServices([]);
      setMeetingType("online");
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
      <div className="border border-cream-300 bg-cream-50 px-8 py-12 text-center shadow-sm md:px-12">
        <CheckCircle2 className="mx-auto size-12 text-gold-700" aria-hidden />
        <p className="mt-6 text-label-caps uppercase text-gold-700">
          Yêu cầu đã được ghi nhận
        </p>
        <h2 className="mt-3 font-heading text-headline-sm text-navy">
          Đã ghi nhận yêu cầu đặt lịch
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-body-md leading-relaxed text-navy/70">
          Cảm ơn bạn. Đội ngũ NHN&D sẽ xem xét thông tin và phản hồi trong
          thời gian sớm nhất.
        </p>
        <Button
          className="mt-8"
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
    <div className="w-full border border-cream-300 bg-cream-50 p-8 shadow-sm md:p-12">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12" noValidate>
        <FormSection
          icon={<UserRound className="size-5" aria-hidden />}
          title="Thông tin cá nhân & Doanh nghiệp"
        >
          <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
            <Field label="Họ và tên" required error={errors.full_name?.message}>
              <input
                {...register("full_name")}
                type="text"
                autoComplete="name"
                className={inputCls}
                placeholder="Nguyễn Văn A"
              />
            </Field>
            <Field label="Email" required error={errors.email?.message}>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className={inputCls}
                placeholder="example@company.com"
              />
            </Field>
            <Field label="Số điện thoại" required error={errors.phone?.message}>
              <input
                {...register("phone", { setValueAs: normalizePhone })}
                type="tel"
                autoComplete="tel"
                className={inputCls}
                placeholder="090 000 0000"
              />
            </Field>
            <Field label="Tên doanh nghiệp">
              <input
                {...register("company")}
                type="text"
                autoComplete="organization"
                className={inputCls}
                placeholder="Công ty NHN Global"
              />
            </Field>
          </div>
        </FormSection>

        <FormSection
          icon={<Network className="size-5" aria-hidden />}
          title="Dịch vụ quan tâm"
        >
          <div className="grid grid-cols-1 gap-x-12 gap-y-5 md:grid-cols-2">
            {services.map((service) => (
              <DemoCheckbox
                key={service.id}
                label={service.title}
                checked={selectedServices.includes(service.title)}
                onChange={() => toggleService(service.title)}
              />
            ))}
            <DemoCheckbox
              label="Vấn đề khác"
              checked={selectedServices.includes("Vấn đề khác")}
              onChange={() => toggleService("Vấn đề khác")}
            />
          </div>
        </FormSection>

        <FormSection
          icon={<MessageSquare className="size-5" aria-hidden />}
          title="Hình thức làm việc"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <MeetingModeCard
              checked={meetingType === "online"}
              icon={<Video className="size-7" aria-hidden />}
              title="Trực tuyến (Online)"
              description="Zoom, Teams, hoặc Google Meet"
              onChange={() => setMeetingType("online")}
            />
            <MeetingModeCard
              checked={meetingType === "offline"}
              icon={<Building2 className="size-7" aria-hidden />}
              title="Trực tiếp (Offline)"
              description="Tại văn phòng NHN hoặc cơ sở của bạn"
              onChange={() => setMeetingType("offline")}
            />
          </div>
        </FormSection>

        <FormSection
          icon={<Edit3 className="size-5" aria-hidden />}
          title="Mô tả tình huống & Yêu cầu"
        >
          <textarea
            {...register("message")}
            rows={5}
            className="min-h-40 w-full resize-none border border-cream-300 bg-cream px-5 py-4 text-body-md text-navy outline-none transition-colors placeholder:text-navy/35 focus:border-gold"
            placeholder="Vui lòng chia sẻ sơ lược về tình trạng hiện tại hoặc nhu cầu cụ thể của quý đối tác..."
          />
          {errors.message && (
            <ErrorText message={errors.message.message} className="mt-2" />
          )}
        </FormSection>

        <div className="space-y-8 border-t border-cream-300 pt-4">
          <label className="flex cursor-pointer items-start gap-3 text-body-md text-navy/70">
            <input
              type="checkbox"
              {...register("consent")}
              className="mt-0.5 size-5 border-cream-300 accent-navy"
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
          {errors.consent && <ErrorText message={errors.consent.message} />}

          <Turnstile
            onToken={setTurnstileToken}
            className="min-h-[65px]"
          />

          {submitState === "error" && formError && (
            <div className="flex items-start gap-2 border border-red-200 bg-red-50 p-3 text-body-sm text-red-800">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              className="w-full min-w-0 md:w-auto md:min-w-[300px]"
              disabled={submitState === "loading"}
            >
              {submitState === "loading" ? (
                "Đang ghi nhận..."
              ) : (
                <>
                  Xác nhận đặt lịch
                  <ArrowRight className="size-4" aria-hidden />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "w-full border-0 border-b border-cream-300 bg-transparent px-0 py-2 text-body-md text-navy outline-none transition-colors placeholder:text-navy/35 focus:border-gold";

function FormSection({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-8 flex items-center gap-3 border-b border-cream-300 pb-3">
        <span className="text-gold-700">{icon}</span>
        <h2 className="text-label-caps uppercase tracking-[0.14em] text-navy">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="group">
      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-navy/60 transition-colors group-focus-within:text-gold-700">
        {label}
        {required && <span className="ml-1 text-gold-700">*</span>}
      </label>
      {children}
      {error && <ErrorText message={error} className="mt-2" />}
    </div>
  );
}

function DemoCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="group flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center border border-navy/35 text-transparent transition-colors peer-checked:border-navy peer-checked:bg-navy peer-checked:text-cream">
        <Check className="size-3.5" aria-hidden />
      </span>
      <span className="text-body-md text-navy/70 transition-colors group-hover:text-navy">
        {label}
      </span>
    </label>
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
        className="peer sr-only"
        name="booking_meeting_mode"
        type="radio"
        checked={checked}
        onChange={onChange}
      />
      <span className="flex h-full items-center gap-4 border border-cream-300 p-6 transition-colors group-hover:border-gold peer-checked:border-gold peer-checked:bg-cream">
        <span className="text-navy">{icon}</span>
        <span>
          <span className="block text-body-md font-bold text-navy">{title}</span>
          <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-navy/50">
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
