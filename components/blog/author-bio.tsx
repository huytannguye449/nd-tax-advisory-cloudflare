import Image from "next/image";
import { User } from "lucide-react";
import type { Author } from "@/lib/supabase/types";

type AuthorBioProps = {
  author: Pick<Author, "name" | "slug" | "avatar_url" | "title" | "bio">;
};

export function AuthorBio({ author }: AuthorBioProps) {
  return (
    <div className="rounded-2xl border border-cream-200 bg-cream-100 p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        {/* Avatar */}
        <div className="shrink-0">
          {author.avatar_url ? (
            <Image
              src={author.avatar_url}
              alt={author.name}
              width={80}
              height={80}
              className="rounded-full object-cover ring-2 ring-cream-200"
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-full bg-navy/10 ring-2 ring-cream-200">
              <User className="size-8 text-navy/40" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-700">
              Tác giả
            </p>
            <h3 className="mt-0.5 text-lg font-bold text-navy">{author.name}</h3>
            {author.title && (
              <p className="text-sm text-navy/60">{author.title}</p>
            )}
          </div>
          {author.bio && (
            <p className="text-sm leading-relaxed text-navy/70">{author.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
}
