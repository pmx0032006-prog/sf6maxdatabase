import { ImageResponse } from "next/og";
import { roster } from "@/data/characters";
import { siteName, siteNameFull } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function getCharacterBySlug(slug: string) {
  return roster.find((character) => character.slug === slug);
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const character = getCharacterBySlug(slug);
  return [
    {
      id: "og",
      alt: `${character?.en ?? slug} SF6 Frame Data and Hitbox Images — ${siteName}`,
    },
  ];
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const character = getCharacterBySlug(slug);
  const name = character?.en ?? slug.toUpperCase();

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
          {name}
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
          SF6 Frame Data &amp; Hitbox Images
        </div>
        <div style={{ marginTop: 48, fontSize: 20, color: "#7f8c82" }}>
          {siteNameFull}
        </div>
      </div>
    ),
    { ...size }
  );
}
