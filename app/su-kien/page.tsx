import type { Metadata } from "next";
import { EventsLive } from "@/components/content/events-live";

export const metadata: Metadata = {
  title: "Sự kiện",
  description:
    "Sự kiện, hội thảo và tọa đàm chuyên môn của NHN&D Tax Advisory dành cho founder, CFO và đội ngũ quản trị.",
};

export default function SuKienPage() {
  return <EventsLive />;
}
