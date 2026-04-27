import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Facebook } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
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
  return (
    <footer className="bg-navy text-cream">
      <Container size="xl" className="py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo variant="reversed" size="md" />
            <p className="mt-5 text-sm leading-relaxed text-cream/80 max-w-sm">
              Tư vấn thuế chiến lược cho SME & FDI tại Việt Nam. Chính xác, bảo mật, tận
              tâm, sắc bén.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-cream/85">
              <li className="flex items-start gap-3">
                <MapPin className="size-4 mt-0.5 text-gold shrink-0" aria-hidden />
                <span>{SITE.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-gold shrink-0" aria-hidden />
                <a href={`mailto:${SITE.email}`} className="hover:text-gold transition">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-gold shrink-0" aria-hidden />
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="hover:text-gold transition"
                >
                  {SITE.phone}
                </a>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={SITE.social.linkedin}
                aria-label="LinkedIn"
                className="inline-flex size-10 items-center justify-center rounded-md border border-cream/20 hover:border-gold hover:text-gold transition"
              >
                <Linkedin className="size-4" />
              </a>
              <a
                href={SITE.social.facebook}
                aria-label="Facebook"
                className="inline-flex size-10 items-center justify-center rounded-md border border-cream/20 hover:border-gold hover:text-gold transition"
              >
                <Facebook className="size-4" />
              </a>
            </div>
          </div>

          {/* Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {FOOTER_NAV.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-cream/80">
                  {col.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="hover:text-gold transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <hr className="mt-12 border-cream/15" />

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-cream/60">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}. Mọi quyền được bảo lưu.
          </p>
          <p>CPA / CPTA · Giấy phép kinh doanh: ĐKKD/HN/2026</p>
        </div>
      </Container>
    </footer>
  );
}
