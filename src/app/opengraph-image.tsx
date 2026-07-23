import { ImageResponse } from "next/og";
import { siteName, siteNameFull, siteTagline } from "@/lib/site";

export const alt = "SF6 MAX DATABASE — Street Fighter 6 frame data and lightweight JPG hitbox images";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0f0c 0%, #16211b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 64,
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {siteNameFull}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 32,
            color: "#a0f0c0",
            maxWidth: 900,
            lineHeight: 1.3,
          }}
        >
          {siteTagline}
        </div>
        <div style={{ marginTop: 48, fontSize: 20, color: "#7f8c82" }}>
          sf6maxdatabase.com
        </div>
      </div>
    ),
    { ...size }
  );
}
