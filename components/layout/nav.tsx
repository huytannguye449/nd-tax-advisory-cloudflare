"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, User, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

const MAIN_NAV = [
  { href: "/su-kien", label: "Sự kiện" },
  { href: "/an-pham", label: "Ấn phẩm" },
  { href: "/ve-chung-toi", label: "Về chúng tôi" },
  { href: "/lien-he", label: "Liên hệ" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [serviceNav, setServiceNav] = useState<
    Array<{ href: string; label: string }>
  >([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/services", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (cancelled || !json.ok) return;
        setServiceNav(
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

  const servicesActive = pathname.startsWith("/dich-vu");

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-cream transition-colors",
        scrolled
          ? "border-b-hairline border-gold"
          : "border-b-hairline border-transparent",
      )}
    >
      <Container size="default">
        <div className="flex h-[72px] items-center justify-between gap-4 md:h-32">
          <Link
            href="/"
            aria-label="NHN&D Tax Advisory - Trang chủ"
            className="shrink-0"
          >
            <Logo variant="horizontal" size="sm" className="h-12 md:hidden" />
            <Logo
              variant="primary"
              size="md"
              className="hidden h-30 md:block"
            />
          </Link>

          <nav
            className="hidden items-center lg:flex"
            aria-label="Điều hướng chính"
          >
            <div className="group relative">
              <Link
                href="/dich-vu"
                className={cn(
                  "inline-flex min-h-[44px] items-center gap-1.5 px-5 py-3 text-label-caps uppercase transition-colors",
                  servicesActive
                    ? "text-gold-700"
                    : "text-navy hover:text-gold-700",
                )}
                aria-haspopup="true"
              >
                Dịch vụ
                <ChevronDown
                  className="size-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                  aria-hidden="true"
                />
              </Link>
              <div className="invisible absolute left-0 top-full w-72 translate-y-2 border-t-hairline border-gold bg-cream opacity-0 shadow-[0_18px_45px_rgba(15,43,70,0.12)] transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="py-3">
                  {serviceNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-5 py-3 text-body-sm font-medium text-navy/75 transition-colors hover:bg-cream-100 hover:text-gold-700"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {MAIN_NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-5 py-3 text-label-caps uppercase transition-colors",
                    active ? "text-gold-700" : "text-navy hover:text-gold-700",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="hidden min-h-[44px] min-w-[44px] items-center justify-center text-navy/60 transition-colors hover:text-gold-700 md:inline-flex"
              aria-label="Đăng nhập quản trị"
              title="Đăng nhập quản trị"
            >
              <User className="size-6" aria-hidden="true" />
            </Link>
            <Button
              asChild
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Link href="/dat-lich">Đặt lịch tư vấn</Link>
            </Button>

            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <button
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-navy transition-colors hover:text-gold-700 lg:hidden"
                  aria-label="Mở menu"
                >
                  <Menu className="size-7" />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-navy/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content
                  className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l-hairline border-gold bg-cream data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
                  aria-describedby={undefined}
                >
                  <div className="flex h-[72px] items-center justify-between border-b-hairline border-gold px-5">
                    <Dialog.Title className="sr-only">Menu</Dialog.Title>
                    <Logo variant="horizontal" size="sm" className="h-12" />
                    <Dialog.Close asChild>
                      <button
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-navy hover:text-gold-700"
                        aria-label="Đóng menu"
                      >
                        <X className="size-6" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <nav
                    className="flex-1 overflow-y-auto p-5"
                    aria-label="Điều hướng di động"
                  >
                    <ul className="flex flex-col">
                      <li className="border-b-hairline border-gold/40">
                        <button
                          type="button"
                          className={cn(
                            "flex min-h-[56px] w-full items-center justify-between py-3 text-left text-label-caps uppercase transition-colors",
                            servicesActive
                              ? "text-gold-700"
                              : "text-navy hover:text-gold-700",
                          )}
                          aria-expanded={servicesOpen}
                          onClick={() => setServicesOpen((value) => !value)}
                        >
                          <span>Dịch vụ</span>
                          <ChevronDown
                            className={cn(
                              "size-4 transition-transform",
                              servicesOpen && "rotate-180",
                            )}
                            aria-hidden="true"
                          />
                        </button>
                        {servicesOpen && (
                          <div className="pb-4">
                            <Link
                              href="/dich-vu"
                              className="block py-2 text-body-sm font-medium text-navy/70 transition-colors hover:text-gold-700"
                            >
                              Tổng quan dịch vụ
                            </Link>
                            {serviceNav.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="block py-2 pl-4 text-body-sm text-navy/60 transition-colors hover:text-gold-700"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </li>
                      {MAIN_NAV.map((item) => {
                        const active =
                          pathname === item.href ||
                          pathname.startsWith(`${item.href}/`);
                        return (
                          <li
                            key={item.href}
                            className="border-b-hairline border-gold/40"
                          >
                            <Link
                              href={item.href}
                              className={cn(
                                "block min-h-[56px] py-5 text-label-caps uppercase transition-colors",
                                active
                                  ? "text-gold-700"
                                  : "text-navy hover:text-gold-700",
                              )}
                            >
                              {item.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>

                  <div className="space-y-4 border-t-hairline border-gold p-5">
                    <Button asChild variant="primary" size="md" fullWidth>
                      <Link href="/dat-lich">Đặt lịch tư vấn</Link>
                    </Button>
                    <Link
                      href="/admin/login"
                      className="flex min-h-[44px] w-full items-center justify-center gap-2 py-2.5 text-label-caps uppercase text-navy/60 hover:text-gold-700"
                    >
                      <User className="size-6" aria-hidden="true" />
                      <span>Quản trị</span>
                    </Link>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </Container>
    </header>
  );
}
