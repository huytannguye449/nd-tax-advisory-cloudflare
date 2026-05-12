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
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    router.replace("/admin/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Logo variant="primary" size="md" />
          <p className="mt-4 text-sm text-navy/60">Đang tải…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-cream-100 flex">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-30 h-14 bg-white border-b border-cream-300 flex items-center justify-between px-4">
        <Logo variant="horizontal" size="sm" />
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Mở menu"
          className="p-2 -m-2"
        >
          <Menu className="size-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl flex flex-col">
            <div className="h-14 flex items-center justify-between px-4 border-b border-cream-300">
              <Logo variant="horizontal" size="sm" />
              <button onClick={() => setMobileOpen(false)} aria-label="Đóng">
                <X className="size-5" />
              </button>
            </div>
            <SidebarContent
              pathname={pathname}
              user={user}
              onLogout={logout}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-72 bg-white border-r border-cream-300 fixed inset-y-0">
        <div className="h-20 flex items-center px-6 border-b border-cream-300">
          <Link href="/admin" aria-label="NHN&D Admin">
            <Logo variant="primary" size="md" />
          </Link>
        </div>
        <SidebarContent pathname={pathname} user={user} onLogout={logout} />
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-72 pt-14 lg:pt-0">
        <div className="p-5 md:p-8 lg:p-10 max-w-7xl">{children}</div>
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
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition min-h-[44px]",
                active
                  ? "bg-navy text-cream"
                  : "text-navy hover:bg-navy/5",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-cream-300 space-y-3">
        <div className="px-3 py-2">
          <p className="text-sm font-semibold text-navy">{user.name || user.username}</p>
          <p className="text-xs text-navy/60">@{user.username} · {user.role}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-navy hover:bg-red-50 hover:text-red-700 transition min-h-[44px]"
        >
          <LogOut className="size-4" aria-hidden /> Đăng xuất
        </button>
      </div>
    </>
  );
}
