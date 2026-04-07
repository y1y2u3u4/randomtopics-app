import { ImageResponse } from "next/og";
import { SEO_ARTICLES } from "@/data/seoContent";

export const alt = "Random Topics Article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = SEO_ARTICLES.find((a) => a.slug === slug);
  const title = article?.heroTitle || "Random Topics";
  const subtitle = article?.heroSubtitle || "";

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
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-40px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,45,120,0.25), transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            right: "-20px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,229,255,0.2), transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        <div style={{ fontSize: "40px", marginBottom: "16px" }}>🎲</div>

        <div
          style={{
            fontSize: "48px",
            fontWeight: 800,
            background: "linear-gradient(135deg, #ff2d78, #b14eff, #00e5ff)",
            backgroundClip: "text",
            color: "transparent",
            letterSpacing: "-1px",
            lineHeight: 1.15,
            textAlign: "center",
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        {subtitle && (
          <div
            style={{
              fontSize: "20px",
              color: "#8b95b0",
              marginTop: "16px",
              textAlign: "center",
              maxWidth: "700px",
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: "30px",
            fontSize: "16px",
            color: "#4a5270",
            letterSpacing: "1.5px",
          }}
        >
          randomtopics.app
        </div>
      </div>
    ),
    { ...size }
  );
}
