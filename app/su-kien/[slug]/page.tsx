import type { Metadata } from "next";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { EventDetailLive } from "@/components/content/event-detail-live";

export const dynamic = "force-static";
export const dynamicParams = false;

const PUBLIC_STATUSES = ["published", "upcoming", "past"] as const;

type EventMetadata = {
  title: string;
  excerpt: string | null;
  description: string | null;
};

export async function generateStaticParams() {
  try {
    const supabase = createBuildClient();
    if (!supabase) return [];
    const { data } = await supabase
      .from("events")
      .select("slug")
      .in("status", PUBLIC_STATUSES);

    return (data ?? []).map((event) => ({ slug: event.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventMetadata(slug);

  if (!event) {
    return {
      title: "Sự kiện",
      description: "Sự kiện của NHN&D Tax Advisory.",
    };
  }

  return {
    title: `${event.title} | Sự kiện | NHN&D Tax Advisory`,
    description:
      event.excerpt ?? event.description ?? "Sự kiện của NHN&D Tax Advisory.",
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <EventDetailLive initialSlug={slug} />;
}

async function getEventMetadata(slug: string) {
  const supabase = createBuildClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("events")
    .select("title, excerpt, description")
    .eq("slug", slug)
    .in("status", PUBLIC_STATUSES)
    .maybeSingle();

  if (error || !data) return null;
  return data as EventMetadata;
}

function createBuildClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createSupabaseClient(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: "no-store",
        }),
    },
  });
}