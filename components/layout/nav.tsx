"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dich-vu", label: "Dịch vụ" },
  { href: "/ve-chung-toi", label: "Về chúng tôi" },
  { href: "/kien-thuc", label: "Kiến thức" },
  { href: "/lien-he", label: "Liên hệ" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  // Hide nav on admin routes (admin has its own shell)
  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-transparent transition-all backdrop-blur-md",
        scrolled
          ? "bg-cream/85 border-cream-300 shadow-[0_1px_0_rgba(15,43,70,0.06)]"
          : "bg-cream",
      )}
    >
      <Container size="xl" className="!px-4 sm:!px-6 lg:!px-8">
        <div className="flex h-20 md:h-24 items-center justify-between gap-4">
          <Link href="/" aria-label="N&D Tax Advisory — Trang chủ" className="shrink-0">
            <Logo variant="horizontal" size="md" className="md:hidden" />
            <Logo variant="primary" size="lg" className="hidden md:block" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Điều hướng chính">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    active
                      ? "text-gold-700 bg-gold/5"
                      : "text-navy hover:text-gold-700 hover:bg-navy/5",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="secondary" size="sm" className="hidden sm:inline-flex">
              <Link href="/dat-lich">Đặt lịch tư vấn</Link>
            </Button>

            {/* Mobile trigger */}
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <button
                  className="lg:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md text-navy hover:bg-navy/5 transition-colors"
                  aria-label="Mở menu"
                >
                  <Menu className="size-6" />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-navy/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content
                  className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-cream shadow-2xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
                  aria-describedby={undefined}
                >
                  <div className="flex items-center justify-between px-5 h-16 border-b border-cream-300">
                    <Dialog.Title className="sr-only">Menu</Dialog.Title>
                    <Logo variant="horizontal" size="md" />
                    <Dialog.Close asChild>
                      <button
                        className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md text-navy hover:bg-navy/5"
                        aria-label="Đóng menu"
                      >
                        <X className="size-6" />
                      </button>
                    </Dialog.Close>
                  </div>
                  <nav className="flex-1 overflow-y-auto p-5">
                    <ul className="flex flex-col gap-1">
                      {NAV_ITEMS.map((item) => {
                        const active =
                          pathname === item.href ||
                          (item.href !== "/" && pathname.startsWith(item.href));
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={cn(
                                "block py-3 px-4 text-base font-medium rounded-md transition-colors min-h-[44px]",
                                active
                                  ? "text-gold-700 bg-gold/10"
                                  : "text-navy hover:bg-navy/5",
                              )}
                            >
                              {item.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                  <div className="p-5 border-t border-cream-300">
                    <Button asChild variant="secondary" size="md" fullWidth>
                      <Link href="/dat-lich">Đặt lịch tư vấn</Link>
                    </Button>
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
