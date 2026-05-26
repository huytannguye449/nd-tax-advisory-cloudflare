"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users2,
  Calendar,
  Mail,
  FileText,
  FolderOpen,
  Tags,
  UserPen,
  Briefcase,
  KeyRound,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Lead", icon: Users2 },
  { href: "/admin/bookings", label: "Lịch hẹn", icon: Calendar },
  { href: "/admin/subscribers", label: "Newsletter", icon: Mail },
  { href: "/admin/posts", label: "Bài viết", icon: FileText },
  { href: "/admin/categories", label: "Chuyên mục", icon: FolderOpen },
  { href: "/admin/tags", label: "Tags", icon: Tags },
  { href: "/admin/people", label: "People", icon: UserPen },
  { href: "/admin/services", label: "Dịch vụ", icon: Briefcase },
  { href: "/admin/events", label: "Sự kiện", icon: Calendar },
  { href: "/admin/profile", label: "Đổi mật khẩu", icon: KeyRound },
];

interface AdminUser {
  id: string;
  username: string;
  name: string | null;
  role: string;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.ok) {
          router.replace("/admin/login");
          return;
        }
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) router.replace("/admin/login");
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => setMobileOpen(false), [pathname]);

  async function logout() {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    router.replace("/admin/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <Logo variant="primary" size="md" />
          <p className="mt-4 text-label-caps uppercase text-navy/60">
            Đang tải…
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Mobile header — flat navy with gold hairline bottom */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-30 h-14 bg-navy border-b-hairline border-gold flex items-center justify-between px-5">
        <Logo variant="horizontal" size="sm" />
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Mở menu"
          className="p-2 -m-2 text-cream hover:text-gold transition-colors"
        >
          <Menu className="size-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-navy/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-navy flex flex-col border-r-hairline border-gold">
            <div className="h-14 flex items-center justify-between px-5 border-b-hairline border-gold">
              <Logo variant="horizontal" size="sm" />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Đóng"
                className="text-cream hover:text-gold transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <SidebarContent pathname={pathname} user={user} onLogout={logout} />
          </div>
        </div>
      )}

      {/* Desktop sidebar — flat navy with gold hairline right */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-navy border-r-hairline border-gold fixed inset-y-0">
        <div className="h-20 flex items-center px-6 border-b-hairline border-gold">
          <Link href="/admin" aria-label="NHN&D Admin">
            <Logo variant="reversed" size="md" />
          </Link>
        </div>
        <SidebarContent pathname={pathname} user={user} onLogout={logout} />
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 bg-cream">
        <div className="p-5 md:p-10 max-w-[var(--container-default)]">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarContent({
  pathname,
  user,
  onLogout,
}: {
  pathname: string;
  user: AdminUser;
  onLogout: () => void;
}) {
  return (
    <>
      <nav className="flex-1 overflow-y-auto">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-6 py-4 text-label-caps uppercase transition-colors border-b-hairline border-gold/30 min-h-[44px]",
                active
                  ? "text-gold border-l-2 border-l-gold"
                  : "text-cream/75 hover:text-gold border-l-2 border-l-transparent",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t-hairline border-gold">
        <div className="px-6 py-4 border-b-hairline border-gold/30">
          <p className="text-label-caps uppercase text-cream">
            {user.name || user.username}
          </p>
          <p className="text-[11px] tracking-[0.05em] text-cream/55 mt-2">
            @{user.username} · {user.role}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-6 py-4 text-label-caps uppercase text-cream/75 hover:text-gold transition-colors min-h-[44px]"
        >
          <LogOut className="size-4" aria-hidden /> Đăng xuất
        </button>
      </div>
    </>
  );
}
