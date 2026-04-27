import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "N&D Tax Advisory — Giúp chủ doanh nghiệp an tâm với mọi quyết định thuế";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF7F0",
          padding: 80,
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily: "Georgia, serif",
            fontSize: 96,
            fontWeight: 700,
            color: "#0F2B46",
            letterSpacing: -2,
          }}
        >
          N<span style={{ color: "#C9A961", margin: "0 8px" }}>&amp;</span>D
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 18,
            letterSpacing: 8,
            fontWeight: 600,
            color: "#0F2B46",
          }}
        >
          TAX ADVISORY
        </div>
        <div
          style={{
            marginTop: 56,
            fontSize: 44,
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            color: "#0F2B46",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.2,
          }}
        >
          Giúp chủ doanh nghiệp an tâm với mọi quyết định thuế
        </div>
        <div
          style={{
            marginTop: 32,
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            color: "#486581",
          }}
        >
          <div style={{ width: 40, height: 2, background: "#C9A961" }} />
          Hà Nội · Việt Nam
          <div style={{ width: 40, height: 2, background: "#C9A961" }} />
        </div>
      </div>
    ),
    size,
  );
}
