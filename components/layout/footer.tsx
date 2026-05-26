"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Facebook, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { Eyebrow } from "@/components/shared/eyebrow";
import { SITE } from "@/lib/utils";

const FOOTER_NAV = [
  {
    title: "Công ty",
    items: [
      { href: "/su-kien", label: "Sự kiện" },
      { href: "/an-pham", label: "Ấn phẩm" },
      { href: "/ve-chung-toi", label: "Về chúng tôi" },
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
  const [services, setServices] = useState<
    Array<{ href: string; label: string }>
  >([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/services", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (cancelled || !json.ok) return;
        setServices(
          (json.services ?? []).map(
            (service: { slug: string; title: string }) => ({
              href: `/dich-vu#${service.slug}`,
              label: service.title,
            }),
          ),
        );
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const footerNav = [
    { title: "Dịch vụ", items: services },
    ...FOOTER_NAV,
  ];

  return (
    <footer className="border-t-hairline border-gold bg-navy text-cream">
      <Container
        size="default"
        className="py-[var(--spacing-section-sm)] md:py-[var(--spacing-section-md)]"
      >
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-[var(--spacing-gutter)]">
          <div className="lg:col-span-4">
            <Logo variant="reversed" size="md" />
            <p className="mt-6 max-w-sm text-body-md text-cream/85">
              Tư vấn thuế chiến lược cho SME &amp; FDI tại Việt Nam. Chính xác,
              bảo mật, tận tâm, sắc bén.
            </p>

            <ul className="mt-8 space-y-4 text-body-sm text-cream/85">
              <li className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-gold"
                  aria-hidden="true"
                />
                <span>{SITE.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail
                  className="size-4 shrink-0 text-gold"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${SITE.email}`}
                  className="transition-colors hover:text-gold"
                >
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone
                  className="size-4 shrink-0 text-gold"
                  aria-hidden="true"
                />
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-gold"
                >
                  {SITE.phone}
                </a>
              </li>
            </ul>

            <div className="mt-8 flex items-center gap-3">
              <a
                href={SITE.social.linkedin}
                aria-label="LinkedIn"
                className="inline-flex size-11 items-center justify-center border border-cream/25 transition-colors hover:border-gold hover:text-gold"
              >
                <Linkedin className="size-4" />
              </a>
              <a
                href={SITE.social.facebook}
                aria-label="Facebook"
                className="inline-flex size-11 items-center justify-center border border-cream/25 transition-colors hover:border-gold hover:text-gold"
              >
                <Facebook className="size-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8 lg:gap-[var(--spacing-gutter)]">
            {footerNav.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <Eyebrow color="gold">{col.title}</Eyebrow>
                <ul className="mt-5 space-y-3 text-body-sm text-cream/85">
                  {col.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="transition-colors hover:text-gold"
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

        <div className="mt-16 border-t-hairline border-gold/40" />

        <div className="mt-6 flex flex-col gap-3 text-[11px] tracking-[0.05em] text-cream/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}. Mọi quyền được bảo
            lưu.
          </p>
          <p>CPA / CPTA · Giấy phép kinh doanh: ĐKKD/HN/2026</p>
        </div>
      </Container>
    </footer>
  );
}
