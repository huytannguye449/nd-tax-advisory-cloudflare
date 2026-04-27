import Image from "next/image";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { cn } from "@/lib/utils";

export const mdxComponents: MDXComponents = {
  // Headings with anchor links
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        "mt-10 mb-4 scroll-mt-24 text-3xl font-bold text-navy leading-tight",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ id, children, className, ...props }) => (
    <h2
      id={id}
      className={cn(
        "group mt-10 mb-4 scroll-mt-24 text-2xl font-bold text-navy leading-snug",
        "border-b border-cream-200 pb-2",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "mt-8 mb-3 scroll-mt-24 text-xl font-bold text-navy leading-snug",
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={cn("mt-6 mb-2 scroll-mt-24 text-lg font-semibold text-navy", className)}
      {...props}
    />
  ),

  // Paragraph
  p: ({ className, ...props }) => (
    <p
      className={cn("my-4 leading-relaxed text-navy/80 text-base md:text-[17px]", className)}
      {...props}
    />
  ),

  // Blockquote — styled as callout box
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "my-6 rounded-r-lg border-l-4 border-gold-500 bg-gold-50 px-5 py-4",
        "text-navy/80 [&>p]:my-0 [&>p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  ),

  // Lists
  ul: ({ className, ...props }) => (
    <ul
      className={cn("my-4 ml-6 list-disc space-y-1.5 text-navy/80", className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn("my-4 ml-6 list-decimal space-y-1.5 text-navy/80", className)}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("leading-relaxed text-base", className)} {...props} />
  ),

  // Table
  table: ({ className, ...props }) => (
    <div className="my-6 w-full overflow-x-auto rounded-lg border border-cream-200">
      <table
        className={cn("w-full border-collapse text-sm", className)}
        {...props}
      />
    </div>
  ),
  thead: ({ className, ...props }) => (
    <thead className={cn("bg-navy text-cream", className)} {...props} />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn("px-4 py-3 text-left font-semibold tracking-wide text-sm", className)}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn(
        "px-4 py-3 border-b border-cream-200 text-navy/80 align-top",
        className,
      )}
      {...props}
    />
  ),
  tr: ({ className, ...props }) => (
    <tr
      className={cn("even:bg-cream-50 transition-colors hover:bg-gold-50/50", className)}
      {...props}
    />
  ),

  // Horizontal rule
  hr: ({ className, ...props }) => (
    <hr className={cn("my-8 border-cream-200", className)} {...props} />
  ),

  // Code
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "rounded bg-navy/5 px-1.5 py-0.5 font-mono text-sm text-navy-700",
        "border border-navy/10",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "my-6 overflow-x-auto rounded-lg bg-navy-900 p-5 text-sm text-cream",
        "[&>code]:bg-transparent [&>code]:border-0 [&>code]:text-cream",
        className,
      )}
      {...props}
    />
  ),

  // Links
  a: ({ className, href, ...props }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("text-gold-700 underline decoration-gold/40 hover:decoration-gold transition-colors", className)}
          {...props}
        />
      );
    }
    return (
      <Link
        href={href ?? "#"}
        className={cn("text-gold-700 underline decoration-gold/40 hover:decoration-gold transition-colors", className)}
        {...props}
      />
    );
  },

  // Strong / em
  strong: ({ className, ...props }) => (
    <strong className={cn("font-bold text-navy", className)} {...props} />
  ),
  em: ({ className, ...props }) => (
    <em className={cn("italic text-navy/90", className)} {...props} />
  ),

  // Image
  img: ({ src, alt, className, ...props }) => {
    if (!src) return null;
    return (
      <span className="block my-6">
        <Image
          src={src as string}
          alt={alt ?? ""}
          width={1200}
          height={675}
          className={cn("w-full rounded-lg object-cover", className)}
          {...(props as object)}
        />
        {alt && (
          <span className="mt-2 block text-center text-xs text-navy/50 italic">{alt}</span>
        )}
      </span>
    );
  },
};
