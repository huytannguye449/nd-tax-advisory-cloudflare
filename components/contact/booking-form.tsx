"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Video,
  Building2,
} from "lucide-react";
import { Button } from "@/components/shared/button";
import { Turnstile } from "@/components/shared/turnstile";
import { bookingSchema, type BookingInput } from "@/lib/validators";
import { SERVICES } from "@/lib/data";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

const SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

function getNextDays(count: number): Date[] {
  const days: Date[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  let i = 1;
  while (days.length < count && i < 60) {
    const d = new Date(start.getTime() + i * 86400000);
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      days.push(d);
    }
    i++;
  }
  return days;
}

const VI_DAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const VI_MONTHS = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

export function BookingForm() {
  const [step, setStep] = useState<Step>(1);
  const [service, setService] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string>("");
  const [meetingType, setMeetingType] = useState<"online" | "offline">("online");
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [bookingId, setBookingId] = useState<string | null>(null);

  const days = useMemo(() => getNextDays(14), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<BookingInput, "scheduled_at" | "service" | "meeting_type" | "turnstileToken">>({
    resolver: zodResolver(
      bookingSchema.omit({ scheduled_at: true, service: true, meeting_type: true, turnstileToken: true }),
    ),
    defaultValues: { consent: false as never },
  });

  const onSubmit = async (data: Omit<BookingInput, "scheduled_at" | "service" | "meeting_type" | "turnstileToken">) => {
    if (!date || !slot || !service) return;
    setSubmitState("loading");
    setErrorMsg("");

    const [hh, mm] = slot.split(":");
    const scheduledAt = new Date(date);
    scheduledAt.setHours(parseInt(hh), parseInt(mm), 0, 0);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          service,
          scheduled_at: scheduledAt.toISOString(),
          meeting_type: meetingType,
          turnstileToken,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Có lỗi xảy ra");
      setBookingId(json.bookingId);
      setSubmitState("success");
    } catch (err) {
      setSubmitState("error");
      setErrorMsg(err instanceof Error ? err.message : "Có lỗi");
    }
  };

  if (submitState === "success") {
    return (
      <div className="border-t-hairline border-gold pt-10 text-center">
        <CheckCircle2 className="mx-auto size-14 text-gold-700" aria-hidden />
        <h2 className="mt-5 font-heading text-headline-sm text-navy">Đã ghi nhận lịch hẹn</h2>
        <p className="mt-3 text-body-md text-navy/80 max-w-lg mx-auto leading-relaxed">
          Cảm ơn bạn. Chúng tôi đã gửi email xác nhận kèm file lịch (.ics).
          Anh Ngọc sẽ confirm slot và gửi link Zoom/Meet (nếu chọn online) trong vòng 4 giờ làm việc.
        </p>
        {bookingId && (
          <p className="mt-4 text-body-sm text-navy/50">Mã đặt lịch: <code className="font-mono">{bookingId.slice(0, 8)}</code></p>
        )}
      </div>
    );
  }

  return (
    <div className="border-t-hairline border-gold">
      {/* Progress indicator — hairline tabs */}
      <div className="py-5 border-b border-cream-300">
        <div className="flex items-center gap-0">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <span
                className={cn(
                  "size-8 flex items-center justify-center font-bold text-label-caps transition",
                  step >= s ? "bg-navy text-cream" : "bg-cream-200 text-navy/40",
                )}
              >
                {s}
              </span>
              <span className={cn("hidden sm:block text-body-sm transition", step >= s ? "text-navy font-semibold" : "text-navy/40")}>
                {s === 1 ? "Dịch vụ" : s === 2 ? "Thời gian" : "Thông tin"}
              </span>
              {s < 3 && <span className="flex-1 h-px bg-cream-300 mx-2" />}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-8">
        {/* Step 1: Service */}
        {step === 1 && (
          <div>
            <h2 className="font-heading text-headline-sm text-navy mb-2">Chọn dịch vụ</h2>
            <p className="text-body-md text-navy/65 mb-8">Bạn muốn tư vấn về vấn đề nào?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-gutter)]">
              {SERVICES.map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => setService(s.title)}
                  className={cn(
                    "text-left border-t-hairline pt-4 transition min-h-[44px]",
                    service === s.title
                      ? "border-gold"
                      : "border-cream-300 hover:border-gold/60",
                  )}
                >
                  <span className="block text-body-md text-navy font-semibold">{s.title}</span>
                  <span className="block text-body-sm text-navy/60 mt-1">{s.short}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setService("Khác")}
                className={cn(
                  "text-left border-t-hairline pt-4 transition min-h-[44px]",
                  service === "Khác" ? "border-gold" : "border-cream-300 hover:border-gold/60",
                )}
              >
                <span className="block text-body-md text-navy font-semibold">Vấn đề khác</span>
                <span className="block text-body-sm text-navy/60 mt-1">Sẽ trao đổi cụ thể trong buổi tư vấn</span>
              </button>
            </div>
            <div className="mt-10 flex justify-end">
              <Button onClick={() => service && setStep(2)} disabled={!service}>
                Tiếp tục <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Date + Time */}
        {step === 2 && (
          <div>
            <h2 className="font-heading text-headline-sm text-navy mb-2">Chọn thời gian</h2>
            <p className="text-body-md text-navy/65 mb-8">Buổi tư vấn 30 phút. Tất cả slots theo giờ Hà Nội (GMT+7).</p>

            <label className="block text-label-caps text-navy/70 uppercase tracking-[0.1em] mb-3 flex items-center gap-2">
              <Calendar className="size-4" /> Ngày
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {days.map((d) => {
                const selected = date?.toDateString() === d.toDateString();
                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    onClick={() => setDate(d)}
                    className={cn(
                      "shrink-0 flex flex-col items-center justify-center w-16 py-3 border-t-[2px] transition",
                      selected ? "border-gold bg-gold/10 text-navy" : "border-cream-300 text-navy/70 hover:border-gold/50",
                    )}
                  >
                    <span className="text-label-caps">{VI_DAYS[d.getDay()]}</span>
                    <span className="text-body-lg font-bold">{d.getDate()}</span>
                    <span className="text-label-caps">{VI_MONTHS[d.getMonth()].slice(0, 3)}</span>
                  </button>
                );
              })}
            </div>

            {date && (
              <>
                <label className="block text-label-caps text-navy/70 uppercase tracking-[0.1em] mt-8 mb-3 flex items-center gap-2">
                  <Clock className="size-4" /> Khung giờ
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {SLOTS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSlot(s)}
                      className={cn(
                        "py-2.5 border text-body-sm font-medium transition min-h-[44px]",
                        slot === s
                          ? "border-gold bg-gold/10 text-navy"
                          : "border-cream-300 text-navy/70 hover:border-gold/50",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <label className="block text-label-caps text-navy/70 uppercase tracking-[0.1em] mt-8 mb-3">Hình thức</label>
                <div className="grid grid-cols-2 gap-[var(--spacing-gutter)]">
                  <button
                    type="button"
                    onClick={() => setMeetingType("online")}
                    className={cn(
                      "border-t-[2px] pt-4 text-left transition",
                      meetingType === "online" ? "border-gold" : "border-cream-300 hover:border-gold/50",
                    )}
                  >
                    <Video className="size-5 mb-2 text-gold-700" />
                    <span className="block text-body-md text-navy font-semibold">Trực tuyến</span>
                    <span className="block text-body-sm text-navy/60">Qua Zoom / Google Meet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMeetingType("offline")}
                    className={cn(
                      "border-t-[2px] pt-4 text-left transition",
                      meetingType === "offline" ? "border-gold" : "border-cream-300 hover:border-gold/50",
                    )}
                  >
                    <Building2 className="size-5 mb-2 text-gold-700" />
                    <span className="block text-body-md text-navy font-semibold">Tại văn phòng</span>
                    <span className="block text-body-sm text-navy/60">Hà Nội</span>
                  </button>
                </div>
              </>
            )}

            <div className="mt-10 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ChevronLeft className="size-4" /> Quay lại
              </Button>
              <Button onClick={() => date && slot && setStep(3)} disabled={!date || !slot}>
                Tiếp tục <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Info form */}
        {step === 3 && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <h2 className="font-heading text-headline-sm text-navy mb-2">Thông tin liên hệ</h2>
            <p className="text-body-md text-navy/65 mb-2">Để chúng tôi gửi confirmation và link họp.</p>

            {/* Summary — flat cream inset */}
            <div className="bg-cream-100 p-5 text-body-sm border-l-2 border-gold">
              <div className="text-navy"><strong>Dịch vụ:</strong> {service}</div>
              <div className="text-navy mt-1"><strong>Thời gian:</strong> {date && date.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })} · {slot}</div>
              <div className="text-navy mt-1"><strong>Hình thức:</strong> {meetingType === "online" ? "Trực tuyến" : "Tại văn phòng"}</div>
            </div>

            <Field label="Họ và tên" required error={errors.full_name?.message}>
              <input {...register("full_name")} type="text" autoComplete="name" className={inputCls} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field label="Email" required error={errors.email?.message}>
                <input {...register("email")} type="email" autoComplete="email" className={inputCls} />
              </Field>
              <Field label="Số điện thoại" required error={errors.phone?.message}>
                <input {...register("phone")} type="tel" autoComplete="tel" className={inputCls} placeholder="0901 234 567" />
              </Field>
            </div>

            <Field label="Tên công ty">
              <input {...register("company")} type="text" autoComplete="organization" className={inputCls} />
            </Field>

            <Field label="Ghi chú thêm" error={errors.message?.message}>
              <textarea {...register("message")} rows={3} className={inputCls} placeholder="Chia sẻ thêm về tình huống bạn muốn thảo luận (không bắt buộc)" />
            </Field>

            <label className="flex items-start gap-3 text-body-sm text-navy/80 cursor-pointer">
              <input type="checkbox" {...register("consent")} className="mt-0.5 size-4 accent-navy" />
              <span>
                Tôi đồng ý với <a href="/dieu-khoan" className="text-gold-700 underline">Điều khoản</a> và <a href="/chinh-sach-bao-mat" className="text-gold-700 underline">Chính sách bảo mật</a>.
              </span>
            </label>
            {errors.consent && <p className="text-body-sm text-red-600">{errors.consent.message}</p>}

            <Turnstile onToken={setTurnstileToken} />

            {submitState === "error" && (
              <div className="flex items-start gap-2 border border-red-200 bg-red-50 p-3 text-body-sm text-red-800">
                <AlertCircle className="size-4 mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between pt-2">
              <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                <ChevronLeft className="size-4" /> Quay lại
              </Button>
              <Button type="submit" size="lg" disabled={submitState === "loading" || !turnstileToken}>
                {submitState === "loading" ? "Đang gửi…" : "Xác nhận đặt lịch"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Bottom-border only — DESIGN.md pattern
const inputCls =
  "w-full bg-transparent border-0 border-b border-navy text-body-md text-navy placeholder:text-navy/40 py-3 px-0 focus:outline-none focus:border-gold transition-colors duration-150 min-h-[48px]";

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-label-caps text-navy/70 uppercase tracking-[0.1em] mb-2">
        {label}{required && <span className="text-gold ml-1">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-body-sm text-red-600 flex items-center gap-1"><AlertCircle className="size-3.5" aria-hidden />{error}</p>}
    </div>
  );
}
