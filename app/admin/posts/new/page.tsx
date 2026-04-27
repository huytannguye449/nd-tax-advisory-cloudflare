"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <AdminShell>
      <div className="space-y-6">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-1 text-sm text-navy/60 hover:text-navy"
        >
          <ArrowLeft className="size-4" /> Danh sách bài viết
        </Link>
        <h1 className="font-heading text-3xl font-bold text-navy">Viết bài mới</h1>
        <PostForm initial={null} />
      </div>
    </AdminShell>
  );
}
