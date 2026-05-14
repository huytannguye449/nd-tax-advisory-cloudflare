import Image from "next/image";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { cn } from "@/lib/utils";

export const mdxComponents: MDXComponents = {
  // Headings — Playfair via font-heading, token classes
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        "mt-10 mb-4 scroll-mt-24 font-heading text-headline-lg text-navy leading-tight",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ id, children, className, ...props }) => (
    <h2
      id={id}
      className={cn(
        "group mt-10 mb-4 scroll-mt-24 font-heading text-headline-md text-navy leading-snug",
        "border-b border-data-row pb-2",
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
        "mt-8 mb-3 scroll-mt-24 font-heading text-headline-sm text-navy leading-snug",
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={cn("mt-6 mb-2 scroll-mt-24 font-heading text-headline-sm text-navy", className)}
      {...props}
    />
  ),

  // Paragraph — body-lg Inter
  p: ({ className, ...props }) => (
    <p
      className={cn("my-4 leading-relaxed text-body-lg text-navy/80", className)}
      {...props}
    />
  ),

  // Blockquote — Playfair italic, gold-700, left gold border (no rounded, no bg)
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "my-6 border-l-2 border-gold pl-6",
        "text-quote text-gold-700 [&>p]:my-0 [&>p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  ),

  // Lists — body-lg
  ul: ({ className, ...props }) => (
    <ul
      className={cn("my-4 ml-6 list-disc space-y-1.5 text-body-lg text-navy/80", className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn("my-4 ml-6 list-decimal space-y-1.5 text-body-lg text-navy/80", className)}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("leading-relaxed text-body-lg", className)} {...props} />
  ),

  // Table — sharp, hairline borders
  table: ({ className, ...props }) => (
    <div className="my-6 w-full overflow-x-auto border border-cream-200">
      <table
        className={cn("w-full border-collapse text-body-sm", className)}
        {...props}
      />
    </div>
  ),
  thead: ({ className, ...props }) => (
    <thead className={cn("bg-navy text-cream", className)} {...props} />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn("px-4 py-3 text-left text-label-caps tracking-wide", className)}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn(
        "px-4 py-3 border-b border-data-row text-navy/80 align-top",
        className,
      )}
      {...props}
    />
  ),
  tr: ({ className, ...props }) => (
    <tr
      className={cn("even:bg-cream-50 transition-colors hover:bg-gold/5", className)}
      {...props}
    />
  ),

  // Horizontal rule — gold hairline
  hr: ({ className, ...props }) => (
    <hr className={cn("hr-gold my-8", className)} {...props} />
  ),

  // Inline code — no rounded
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "bg-cream-200 px-1.5 py-0.5 text-[0.9em] font-mono text-navy border border-navy/10",
        className,
      )}
      {...props}
    />
  ),
  // Code block — navy bg, no rounded
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "my-6 overflow-x-auto bg-navy p-4 text-body-sm text-cream font-mono",
        "[&>code]:bg-transparent [&>code]:border-0 [&>code]:text-cream",
        className,
      )}
      {...props}
    />
  ),

  // Links — navy underline, gold decoration
  a: ({ className, href, ...props }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("text-navy underline decoration-gold underline-offset-4 hover:text-gold-700 transition-colors", className)}
          {...props}
        />
      );
    }
    return (
      <Link
        href={href ?? "#"}
        className={cn("text-navy underline decoration-gold underline-offset-4 hover:text-gold-700 transition-colors", className)}
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

  // Image — no rounded, no shadow
  img: ({ src, alt, className, ...props }) => {
    if (!src) return null;
    return (
      <span className="block my-6">
        <Image
          src={src as string}
          alt={alt ?? ""}
          width={1200}
          height={675}
          className={cn("w-full object-cover", className)}
          {...(props as object)}
        />
        {alt && (
          <span className="mt-2 block text-center text-body-sm text-navy/50 italic">{alt}</span>
        )}
      </span>
    );
  },
};
