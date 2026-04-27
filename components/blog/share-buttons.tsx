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

  const btnBase = cn(
    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
    "border border-cream-200 bg-white transition-all hover:border-navy/30 hover:shadow-sm",
    "min-h-[40px]",
  );

  return (
    <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Chia sẻ bài viết">
      <span className="text-sm text-navy/50 mr-1">Chia sẻ:</span>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded.url}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(btnBase, "text-[#1877F2]")}
        aria-label="Chia sẻ lên Facebook"
      >
        <Facebook className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Facebook</span>
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded.url}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(btnBase, "text-[#0A66C2]")}
        aria-label="Chia sẻ lên LinkedIn"
      >
        <Linkedin className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">LinkedIn</span>
      </a>

      <button
        onClick={handleCopy}
        className={cn(
          btnBase,
          copied ? "text-green-600 border-green-200 bg-green-50" : "text-navy/70",
        )}
        aria-label={copied ? "Đã sao chép liên kết" : "Sao chép liên kết"}
      >
        <Copy className="size-4" aria-hidden="true" />
        <span>{copied ? "Đã sao chép!" : "Sao chép"}</span>
      </button>
    </div>
  );
}
