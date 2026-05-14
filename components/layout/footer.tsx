"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, Linkedin, Facebook } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { Eyebrow } from "@/components/shared/eyebrow";
import { SITE } from "@/lib/utils";

const FOOTER_NAV = [
  {
    title: "Dịch vụ",
    items: [
      { href: "/dich-vu#kien-toan-ke-toan", label: "Kiện toàn kế toán" },
      { href: "/dich-vu#tu-van-phap-ly", label: "Tư vấn pháp lý & thuế" },
      { href: "/dich-vu#cau-truc-kinh-doanh", label: "Cấu trúc kinh doanh" },
      { href: "/dich-vu#dao-tao", label: "Đào tạo doanh nghiệp" },
    ],
  },
  {
    title: "Công ty",
    items: [
      { href: "/ve-chung-toi", label: "Về chúng tôi" },
      { href: "/kien-thuc", label: "Kiến thức" },
      { href: "/lien-he", label: "Liên hệ" },
      { href: "/dat-lich", label: "Đặt lịch tư vấn" },
    ],
  },
  {
    title: "Pháp lý",
    items: [
      { href: "/chinh-sach-bao-mat", label: "Chính sách bảo mật" },
      { href: "/dieu-khoan", label: "Điều khoản sử dụng" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="bg-navy text-cream border-t-hairline border-gold">
      <Container size="default" className="py-[var(--spacing-section-sm)] md:py-[var(--spacing-section-md)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-[var(--spacing-gutter)]">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo variant="reversed" size="md" />
            <p className="mt-6 text-body-md text-cream/85 max-w-sm">
              Tư vấn thuế chiến lược cho SME &amp; FDI tại Việt Nam. Chính xác, bảo mật, tận tâm, sắc bén.
            </p>

            <ul className="mt-8 space-y-4 text-body-sm text-cream/85">
              <li className="flex items-start gap-3">
                <MapPin className="size-4 mt-0.5 text-gold shrink-0" aria-hidden />
                <span>{SITE.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-gold shrink-0" aria-hidden />
                <a href={`mailto:${SITE.email}`} className="hover:text-gold transition-colors">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-gold shrink-0" aria-hidden />
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="hover:text-gold transition-colors"
                >
                  {SITE.phone}
                </a>
              </li>
            </ul>

            <div className="mt-8 flex items-center gap-3">
              <a
                href={SITE.social.linkedin}
                aria-label="LinkedIn"
                className="inline-flex size-11 items-center justify-center border border-cream/25 hover:border-gold hover:text-gold transition-colors"
              >
                <Linkedin className="size-4" />
              </a>
              <a
                href={SITE.social.facebook}
                aria-label="Facebook"
                className="inline-flex size-11 items-center justify-center border border-cream/25 hover:border-gold hover:text-gold transition-colors"
              >
                <Facebook className="size-4" />
              </a>
            </div>
          </div>

          {/* Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-10 lg:gap-[var(--spacing-gutter)]">
            {FOOTER_NAV.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <Eyebrow color="gold">{col.title}</Eyebrow>
                <ul className="mt-5 space-y-3 text-body-sm text-cream/85">
                  {col.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="hover:text-gold transition-colors">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Gold hairline divider */}
        <div className="mt-16 border-t-hairline border-gold/40" />

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[11px] tracking-[0.05em] text-cream/65">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}. Mọi quyền được bảo lưu.
          </p>
          <p>CPA / CPTA · Giấy phép kinh doanh: ĐKKD/HN/2026</p>
        </div>
      </Container>
    </footer>
  );
}
