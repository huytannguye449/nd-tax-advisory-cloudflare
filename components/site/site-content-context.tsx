"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  ClientLogo,
  PageSection,
  SiteStat,
  SiteValue,
  Testimonial,
  TimelineItem,
} from "@/lib/supabase/types";

interface SiteContentResponse {
  ok: boolean;
  sections?: PageSection[];
  client_logos?: ClientLogo[];
  home_client_logos?: ClientLogo[];
  values?: SiteValue[];
  stats?: SiteStat[];
  testimonials?: Testimonial[];
  timeline_items?: TimelineItem[];
}

interface SiteContentState {
  loading: boolean;
  sections: Record<string, PageSection>;
  clientLogos: ClientLogo[];
  homeClientLogos: ClientLogo[];
  values: SiteValue[];
  stats: SiteStat[];
  testimonials: Testimonial[];
  timelineItems: TimelineItem[];
}

const SiteContentContext = createContext<SiteContentState>({
  loading: true,
  sections: {},
  clientLogos: [],
  homeClientLogos: [],
  values: [],
  stats: [],
  testimonials: [],
  timelineItems: [],
});

export function SiteContentProvider({
  pageSlug,
  children,
}: {
  pageSlug: "home" | "about";
  children: ReactNode;
}) {
  const [state, setState] = useState<SiteContentState>({
    loading: true,
    sections: {},
    clientLogos: [],
    homeClientLogos: [],
    values: [],
    stats: [],
    testimonials: [],
    timelineItems: [],
  });

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/public/site-content?page=${encodeURIComponent(pageSlug)}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((json: SiteContentResponse) => {
        if (cancelled || !json.ok) return;
        const sections = (json.sections ?? []).map(repairCmsItem);
        setState({
          loading: false,
          sections: Object.fromEntries(
            sections.map((section) => [
              section.section_key,
              section,
            ]),
          ),
          clientLogos: (json.client_logos ?? []).map(repairCmsItem),
          homeClientLogos: (json.home_client_logos ?? []).map(repairCmsItem),
          values: (json.values ?? []).map(repairCmsItem),
          stats: (json.stats ?? []).map(repairCmsItem),
          testimonials: (json.testimonials ?? []).map(repairCmsItem),
          timelineItems: (json.timeline_items ?? []).map(repairCmsItem),
        });
      })
      .catch(() => {
        if (!cancelled) setState((prev) => ({ ...prev, loading: false }));
      });
    return () => {
      cancelled = true;
    };
  }, [pageSlug]);

  const value = useMemo(() => state, [state]);

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}

export function splitParagraphs(value: string | null | undefined) {
  return (value ?? "")
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

const MOJIBAKE_PATTERN = /(?:Ã|Ä|Æ|áº|á»|â€)/;

const WINDOWS_1252_BYTES: Record<number, number> = {
  0x20ac: 0x80,
  0x201a: 0x82,
  0x0192: 0x83,
  0x201e: 0x84,
  0x2026: 0x85,
  0x2020: 0x86,
  0x2021: 0x87,
  0x02c6: 0x88,
  0x2030: 0x89,
  0x0160: 0x8a,
  0x2039: 0x8b,
  0x0152: 0x8c,
  0x017d: 0x8e,
  0x2018: 0x91,
  0x2019: 0x92,
  0x201c: 0x93,
  0x201d: 0x94,
  0x2022: 0x95,
  0x2013: 0x96,
  0x2014: 0x97,
  0x02dc: 0x98,
  0x2122: 0x99,
  0x0161: 0x9a,
  0x203a: 0x9b,
  0x0153: 0x9c,
  0x017e: 0x9e,
  0x0178: 0x9f,
};

function repairCmsItem<T>(item: T): T {
  if (typeof item === "string") {
    return repairMojibakeText(item) as T;
  }
  if (Array.isArray(item)) {
    return item.map(repairCmsItem) as T;
  }
  if (item && typeof item === "object") {
    return Object.fromEntries(
      Object.entries(item).map(([key, value]) => [key, repairCmsItem(value)]),
    ) as T;
  }
  return item;
}

function repairMojibakeText(value: string) {
  if (!MOJIBAKE_PATTERN.test(value)) return value;

  const bytes: number[] = [];
  for (const char of value) {
    const code = char.codePointAt(0);
    if (code === undefined) return value;
    if (code <= 0xff) {
      bytes.push(code);
      continue;
    }
    const byte = WINDOWS_1252_BYTES[code];
    if (byte === undefined) return value;
    bytes.push(byte);
  }

  const decoded = new TextDecoder("utf-8").decode(new Uint8Array(bytes));
  return mojibakeScore(decoded) < mojibakeScore(value) ? decoded : value;
}

function mojibakeScore(value: string) {
  return (value.match(MOJIBAKE_PATTERN) ?? []).length;
}
