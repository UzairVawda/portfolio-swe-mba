import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Uzair Vawda — Engineer, MBA candidate";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 96px",
          background:
            "radial-gradient(at 20% 30%, #1a1a35 0%, #0c0c16 60%)",
          color: "#f4f4f8",
          fontFamily: "system-ui, -apple-system, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily: "monospace",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#a1a1b8",
          }}
        >
          ./uzair · portfolio
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 120,
              lineHeight: 1,
              fontWeight: 600,
              letterSpacing: "-0.04em",
            }}
          >
            Uzair Vawda.
          </div>
          <div
            style={{
              fontSize: 44,
              lineHeight: 1.1,
              color: "#a1a1b8",
              fontWeight: 300,
            }}
          >
            Engineer. MBA candidate. NYC.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                background: "#6666ff",
              }}
            />
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                background: "#b8baff",
              }}
            />
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                background: "#c9e8ff",
              }}
            />
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                background: "#b9f0d7",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 22,
              color: "#a1a1b8",
            }}
          >
            uzairvawda.me
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
