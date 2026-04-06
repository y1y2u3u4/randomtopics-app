import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Random Topic Generator - Free Conversation, Writing & Debate Topics";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
          position: "relative",
        }}
      >
        {/* Gradient orb effects */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-50px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,45,120,0.3), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "-30px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,229,255,0.25), transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Emoji */}
        <div style={{ fontSize: "80px", marginBottom: "20px" }}>🎲</div>

        {/* Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 800,
            background: "linear-gradient(135deg, #ff2d78, #b14eff, #00e5ff)",
            backgroundClip: "text",
            color: "transparent",
            letterSpacing: "-2px",
            lineHeight: 1.1,
            textAlign: "center",
            padding: "0 60px",
          }}
        >
          Random Topic Generator
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "24px",
            color: "#8b95b0",
            marginTop: "20px",
            textAlign: "center",
            padding: "0 80px",
            lineHeight: 1.4,
          }}
        >
          500+ topics for conversations, writing, debates, speeches & icebreakers
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "18px",
            color: "#4a5270",
            letterSpacing: "2px",
          }}
        >
          randomtopics.app
        </div>
      </div>
    ),
    { ...size }
  );
}
