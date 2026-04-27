"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      reset: (id?: string) => void;
    };
  }
}

interface TurnstileProps {
  onToken: (token: string) => void;
  className?: string;
}

export function Turnstile({ onToken, className }: TurnstileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !ref.current) return;
    const interval = setInterval(() => {
      if (window.turnstile && ref.current && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(ref.current, {
          sitekey: siteKey,
          callback: onToken,
          theme: "light",
        });
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [siteKey, onToken]);

  if (!siteKey) {
    // Dev fallback — auto-pass with empty token
    useEffect(() => {
      onToken("dev-mock-token");
    }, [onToken]);
    return null;
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      />
      <div ref={ref} className={className} />
    </>
  );
}
