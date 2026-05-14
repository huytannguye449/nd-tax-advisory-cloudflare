"use client";

import { useState } from "react";
import { Copy, Facebook, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encoded = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
  };

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // Outline navy sharp buttons — hover gold
  const btnBase = cn(
    "inline-flex items-center gap-2 px-3 py-2 text-body-sm font-medium",
    "border border-navy/20 bg-transparent text-navy transition-all hover:border-gold hover:text-gold-700",
    "min-h-[40px]",
  );

  return (
    <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Chia sẻ bài viết">
      <span className="text-body-sm text-navy/50 mr-1">Chia sẻ:</span>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded.url}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnBase}
        aria-label="Chia sẻ lên Facebook"
      >
        <Facebook className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Facebook</span>
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded.url}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnBase}
        aria-label="Chia sẻ lên LinkedIn"
      >
        <Linkedin className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">LinkedIn</span>
      </a>

      <button
        onClick={handleCopy}
        className={cn(
          btnBase,
          copied ? "border-gold text-gold-700 bg-gold/5" : "",
        )}
        aria-label={copied ? "Đã sao chép liên kết" : "Sao chép liên kết"}
      >
        <Copy className="size-4" aria-hidden="true" />
        <span>{copied ? "Đã sao chép!" : "Sao chép"}</span>
      </button>
    </div>
  );
}
