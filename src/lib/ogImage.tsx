import { ImageResponse } from "next/og";

// Shared branded Open Graph image renderer. Keeps the 1200×630 social card
// visually consistent with the root opengraph-image while letting each dynamic
// route pass its own emoji / title / subtitle for differentiated share previews.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

interface OgImageOptions {
  emoji: string;
  title: string;
  subtitle?: string;
}

export function renderOgImage({ emoji, title, subtitle }: OgImageOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #08080f 0%, #0e0e1a 50%, #08080f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        {/* Gradient orb effects */}
        <div
          style={{
            position: "absolute",
            top: "-90px",
            left: "-50px",
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,45,120,0.28), transparent 70%)",
            filter: "blur(55px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-70px",
            right: "-30px",
            width: "460px",
            height: "460px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,229,255,0.22), transparent 70%)",
            filter: "blur(55px)",
          }}
        />

        {/* Emoji */}
        <div style={{ fontSize: "72px", marginBottom: "18px" }}>{emoji}</div>

        {/* Title */}
        <div
          style={{
            fontSize: "58px",
            fontWeight: 800,
            background: "linear-gradient(135deg, #ff2d78, #b14eff, #00e5ff)",
            backgroundClip: "text",
            color: "transparent",
            letterSpacing: "-1.5px",
            lineHeight: 1.1,
            textAlign: "center",
            maxWidth: "980px",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontSize: "24px",
              color: "#8b95b0",
              marginTop: "20px",
              textAlign: "center",
              maxWidth: "760px",
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: "36px",
            fontSize: "18px",
            color: "#4a5270",
            letterSpacing: "2px",
          }}
        >
          randomtopics.app
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
