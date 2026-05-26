"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import {
  PublicationCard,
  publicationFromPost,
} from "@/components/content/publication-card";
import type { PostWithMeta } from "@/lib/supabase/types";

interface PostsResponse {
  ok: boolean;
  error?: string;
  posts?: PostWithMeta[];
}

function PostSkeleton() {
  return (
    <div className="flex flex-col gap-5 border-t-hairline border-gold pt-6">
      <div className="h-4 w-24 animate-pulse bg-cream-200" />
      <div className="h-6 w-full animate-pulse bg-cream-200" />
      <div className="h-4 w-3/4 animate-pulse bg-cream-200" />
      <p className="text-body-sm text-navy/40">Ấn phẩm sắp xuất bản</p>
    </div>
  );
}

export function BlogPreview() {
  const [posts, setPosts] = useState<PostWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/posts", { cache: "no-store" })
      .then((res) => res.json())
      .then((json: PostsResponse) => {
        if (cancelled) return;
        if (!json.ok) setError(json.error || "Không tải được ấn phẩm");
        else setPosts((json.posts ?? []).slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) setError("Không tải được ấn phẩm");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Section bg="cream" spacing="md" hairlineTop>
      <Container size="default">
        <SectionHeader
          eyebrow="Ấn phẩm"
          title="Ấn phẩm mới"
          description="Phân tích thuế chiến lược, cập nhật chính sách và góc nhìn thực tiễn từ đội ngũ NHN&D."
          split
          className="mb-16"
        />

        <div className="grid grid-cols-1 gap-[var(--spacing-gutter)] md:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
          ) : error ? (
            <div className="border-t-hairline border-gold pt-6 text-body-md text-navy/55 md:col-span-3">
              {error}
            </div>
          ) : posts.length === 0 ? (
            <div className="border-t-hairline border-gold pt-6 text-body-md text-navy/55 md:col-span-3">
              Chưa có ấn phẩm published.
            </div>
          ) : (
            posts.map((post) => (
              <PublicationCard
                key={post.id}
                publication={publicationFromPost(post)}
                variant="default"
              />
            ))
          )}
        </div>

        <div className="mt-16 flex justify-start">
          <Button variant="secondary" size="md" asChild>
            <Link href="/an-pham">Xem tất cả ấn phẩm</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
