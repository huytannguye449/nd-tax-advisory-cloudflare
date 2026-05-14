"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm } from "@/components/admin/post-form";
import { Eyebrow } from "@/components/shared/eyebrow";

export default function NewPostPage() {
  return (
    <AdminShell>
      <div className="space-y-8">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-1 text-label-caps uppercase text-navy/65 hover:text-gold-700 transition-colors"
        >
          <ArrowLeft className="size-4" /> Danh sách bài viết
        </Link>
        <div className="border-b-hairline border-gold pb-6">
          <Eyebrow color="gold">New Post</Eyebrow>
          <h1 className="text-headline-lg font-heading text-navy mt-4">Viết bài mới</h1>
        </div>
        <PostForm initial={null} />
      </div>
    </AdminShell>
  );
}
