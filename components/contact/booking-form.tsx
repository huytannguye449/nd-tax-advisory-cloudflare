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
      <div className="rounded-xl border border-gold-300 bg-gold-50 p-8 md:p-10 text-center">
        <CheckCircle2 className="mx-auto size-14 text-gold-700" aria-hidden />
        <h2 className="mt-5 text-2xl md:text-3xl font-bold text-navy">Đã ghi nhận lịch hẹn</h2>
        <p className="mt-3 text-navy/80 max-w-lg mx-auto leading-relaxed">
          Cảm ơn bạn. Chúng tôi đã gửi email xác nhận kèm file lịch (.ics).
          Anh Ngọc sẽ confirm slot và gửi link Zoom/Meet (nếu chọn online) trong vòng 4 giờ làm việc.
        </p>
        {bookingId && (
          <p className="mt-4 text-sm text-navy/50">Mã đặt lịch: <code className="font-mono">{bookingId.slice(0, 8)}</code></p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white border border-cream-300 shadow-sm">
      {/* Progress */}
      <div className="px-6 md:px-8 pt-6 pb-4 border-b border-cream-200">
        <div className="flex items-center justify-between text-sm">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <span
                className={cn(
                  "size-8 rounded-full flex items-center justify-center font-bold text-sm transition",
                  step >= s ? "bg-navy text-cream" : "bg-cream-200 text-navy/40",
                )}
              >
                {s}
              </span>
              <span className={cn("hidden sm:block", step >= s ? "text-navy font-medium" : "text-navy/40")}>
                {s === 1 ? "Dịch vụ" : s === 2 ? "Thời gian" : "Thông tin"}
              </span>
              {s < 3 && <span className="flex-1 h-px bg-cream-200" />}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8 lg:p-10">
        {/* Step 1: Service */}
        {step === 1 && (
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-navy mb-2">Chọn dịch vụ</h2>
            <p className="text-navy/65 mb-6">Bạn muốn tư vấn về vấn đề nào?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICES.map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => setService(s.title)}
                  className={cn(
                    "text-left p-4 rounded-lg border-2 transition min-h-[44px]",
                    service === s.title
                      ? "border-gold bg-gold/5"
                      : "border-cream-300 hover:border-gold/50",
                  )}
                >
                  <span className="block font-semibold text-navy">{s.title}</span>
                  <span className="block text-xs text-navy/60 mt-1">{s.short}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setService("Khác")}
                className={cn(
                  "text-left p-4 rounded-lg border-2 transition min-h-[44px]",
                  service === "Khác" ? "border-gold bg-gold/5" : "border-cream-300 hover:border-gold/50",
                )}
              >
                <span className="block font-semibold text-navy">Vấn đề khác</span>
                <span className="block text-xs text-navy/60 mt-1">Sẽ trao đổi cụ thể trong buổi tư vấn</span>
              </button>
            </div>
            <div className="mt-8 flex justify-end">
              <Button onClick={() => service && setStep(2)} disabled={!service}>
                Tiếp tục <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Date + Time */}
        {step === 2 && (
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-navy mb-2">Chọn thời gian</h2>
            <p className="text-navy/65 mb-6">Buổi tư vấn 30 phút. Tất cả slots theo giờ Hà Nội (GMT+7).</p>

            <label className="block text-sm font-medium text-navy mb-3 flex items-center gap-2">
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
                      "shrink-0 flex flex-col items-center justify-center w-16 py-3 rounded-lg border-2 transition",
                      selected ? "border-gold bg-gold/10 text-navy" : "border-cream-300 text-navy/70 hover:border-gold/50",
                    )}
                  >
                    <span className="text-xs font-medium">{VI_DAYS[d.getDay()]}</span>
                    <span className="text-lg font-bold">{d.getDate()}</span>
                    <span className="text-xs">{VI_MONTHS[d.getMonth()].slice(0, 3)}</span>
                  </button>
                );
              })}
            </div>

            {date && (
              <>
                <label className="block text-sm font-medium text-navy mt-6 mb-3 flex items-center gap-2">
                  <Clock className="size-4" /> Khung giờ
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {SLOTS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSlot(s)}
                      className={cn(
                        "py-2.5 rounded-md border text-sm font-medium transition min-h-[44px]",
                        slot === s
                          ? "border-gold bg-gold/10 text-navy"
                          : "border-cream-300 text-navy/70 hover:border-gold/50",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <label className="block text-sm font-medium text-navy mt-6 mb-3">Hình thức</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMeetingType("online")}
                    className={cn(
                      "p-4 rounded-lg border-2 text-left transition",
                      meetingType === "online" ? "border-gold bg-gold/5" : "border-cream-300",
                    )}
                  >
                    <Video className="size-5 mb-1 text-gold-700" />
                    <span className="block font-semibold text-navy text-sm">Trực tuyến</span>
                    <span className="block text-xs text-navy/60">Qua Zoom / Google Meet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMeetingType("offline")}
                    className={cn(
                      "p-4 rounded-lg border-2 text-left transition",
                      meetingType === "offline" ? "border-gold bg-gold/5" : "border-cream-300",
                    )}
                  >
                    <Building2 className="size-5 mb-1 text-gold-700" />
                    <span className="block font-semibold text-navy text-sm">Tại văn phòng</span>
                    <span className="block text-xs text-navy/60">Hà Nội</span>
                  </button>
                </div>
              </>
            )}

            <div className="mt-8 flex justify-between">
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <h2 className="text-xl md:text-2xl font-bold text-navy mb-2">Thông tin liên hệ</h2>
            <p className="text-navy/65 mb-2">Để chúng tôi gửi confirmation và link họp.</p>

            {/* Summary */}
            <div className="rounded-lg bg-cream-100 p-4 text-sm border border-cream-300">
              <div><strong>Dịch vụ:</strong> {service}</div>
              <div><strong>Thời gian:</strong> {date && date.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })} · {slot}</div>
              <div><strong>Hình thức:</strong> {meetingType === "online" ? "Trực tuyến" : "Tại văn phòng"}</div>
            </div>

            <Field label="Họ và tên" required error={errors.full_name?.message}>
              <input {...register("full_name")} type="text" autoComplete="name" className={inputCls} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

            <label className="flex items-start gap-3 text-sm text-navy/80 cursor-pointer">
              <input type="checkbox" {...register("consent")} className="mt-0.5 size-4 accent-navy" />
              <span>
                Tôi đồng ý với <a href="/dieu-khoan" className="text-gold-700 underline">Điều khoản</a> và <a href="/chinh-sach-bao-mat" className="text-gold-700 underline">Chính sách bảo mật</a>.
              </span>
            </label>
            {errors.consent && <p className="text-sm text-red-600">{errors.consent.message}</p>}

            <Turnstile onToken={setTurnstileToken} />

            {submitState === "error" && (
              <div className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
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

const inputCls =
  "w-full rounded-md border border-cream-300 bg-white px-4 py-3 text-base text-navy placeholder:text-navy/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 transition min-h-[48px]";

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy mb-1.5">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="size-3.5" aria-hidden />{error}</p>}
    </div>
  );
}
