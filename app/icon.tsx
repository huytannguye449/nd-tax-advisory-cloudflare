import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0F2B46",
          color: "#FAF7F0",
          fontFamily: "Georgia, serif",
          fontSize: 38,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        N<span style={{ color: "#C9A961" }}>&amp;</span>D
      </div>
    ),
    size,
  );
}
