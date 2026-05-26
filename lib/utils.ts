import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, locale = "vi-VN"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatDateShort(date: string | Date, locale = "vi-VN"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export function viSlugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function calcReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "…";
}

export const SITE = {
  name: "NHN&D Tax Advisory",
  legalName: "Công ty TNHH Tư vấn thuế NHN&D",
  tagline: "Giúp chủ doanh nghiệp an tâm với mọi quyết định thuế.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ndtax.vn",
  email: "Hoaingoc.sa@gmail.com",
  phone: "+84 986 032 472",
  phoneDisplay: "0986 032 472",
  address: "Hà Nội, Việt Nam",
  founded: 2026,
  founder: "Nguyễn Hoài Ngọc",
  founderTitle: "CPA / CPTA — Founder & CEO",
  social: {
    // TODO: swap khi a Ngọc tạo profile NHN&D
    linkedin: "https://www.linkedin.com/company/nd-tax-advisory",
    // TODO: swap khi a Ngọc tạo profile NHN&D
    facebook: "https://www.facebook.com/ndtaxadvisory",
  },
} as const;
