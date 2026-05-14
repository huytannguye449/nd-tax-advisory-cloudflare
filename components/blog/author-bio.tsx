import Image from "next/image";
import { User } from "lucide-react";
import { Eyebrow } from "@/components/shared/eyebrow";
import type { Author } from "@/lib/supabase/types";

type AuthorBioProps = {
  author: Pick<Author, "name" | "slug" | "avatar_url" | "title" | "bio">;
};

export function AuthorBio({ author }: AuthorBioProps) {
  return (
    <div className="border-t-hairline border-gold pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        {/* Avatar — square, no rounded */}
        <div className="shrink-0">
          {author.avatar_url ? (
            <Image
              src={author.avatar_url}
              alt={author.name}
              width={80}
              height={80}
              className="object-cover border border-cream-300"
            />
          ) : (
            <div className="flex size-20 items-center justify-center bg-navy/10 border border-cream-300">
              <User className="size-8 text-navy/40" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2">
          <div>
            <Eyebrow color="gold" className="mb-1">Tác giả</Eyebrow>
            <h3 className="font-heading text-headline-sm text-navy">{author.name}</h3>
            {author.title && (
              <p className="text-body-sm text-navy/60 mt-0.5">{author.title}</p>
            )}
          </div>
          {author.bio && (
            <p className="text-body-sm text-navy/70 leading-relaxed">{author.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
}
