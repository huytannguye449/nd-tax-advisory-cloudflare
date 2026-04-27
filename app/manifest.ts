import type { MetadataRoute } from "next";
import { SITE } from "@/lib/utils";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "N&D Tax",
    description: SITE.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7F0",
    theme_color: "#0F2B46",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
