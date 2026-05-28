import { z } from "zod";

const PHONE_VN = /^(\+84|0)\d{9,10}$/;
const CONSENT_MESSAGE =
  "Vui lòng xác nhận rằng bạn đã đọc và đồng ý với Điều khoản và Chính sách bảo mật.";

const consentSchema = z.boolean().refine((value) => value === true, {
  message: CONSENT_MESSAGE,
});

export const leadSchema = z.object({
  full_name: z.string().min(2, "Vui lòng nhập họ tên").max(100),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().regex(PHONE_VN, "Số điện thoại không hợp lệ"),
  company: z.string().max(200).optional().or(z.literal("")),
  company_size: z.enum(["<10", "10-50", "50-200", ">200"]).optional(),
  services: z.array(z.string()).max(10).optional(),
  meeting_type: z.enum(["online", "offline"]).default("online"),
  meeting_link: z.string().max(500).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  source: z.string().max(100).optional(),
  consent: consentSchema,
  turnstileToken: z.string().min(1, "Vui lòng xác nhận captcha"),
});
export type LeadInput = z.infer<typeof leadSchema>;

export const subscribeSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  source: z.string().max(50).optional(),
});
export type SubscribeInput = z.infer<typeof subscribeSchema>;

export const bookingSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(PHONE_VN),
  company: z.string().max(200).optional().or(z.literal("")),
  services: z.array(z.string().trim().min(1)).min(1).max(10),
  meeting_type: z.enum(["online", "offline"]).default("online"),
  message: z.string().max(2000).optional().or(z.literal("")),
  consent: consentSchema,
  turnstileToken: z.string().min(1),
});
export type BookingInput = z.infer<typeof bookingSchema>;
