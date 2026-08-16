import type { ReactElement } from "react";

import { tokens } from "@/lib/theme/tokens";

export const OG_SIZE = { width: 1200, height: 630 };

const t = tokens.dark;

/**
 * The shared Open Graph card.
 *
 * Satori resolves no CSS variables and inherits no stylesheet, so every value
 * here is a literal. They are read off tokens.ts rather than typed out, so the
 * card cannot drift off the palette the site is painted in.
 */
export function ogCard({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px 96px",
        background: t.ground,
        color: t.ink,
        fontFamily: "system-ui, -apple-system, Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "monospace",
          fontSize: 22,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: t.signal,
        }}
      >
        {eyebrow}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: 88,
            lineHeight: 1.05,
            fontWeight: 600,
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 36, lineHeight: 1.2, color: t.muted }}>
          {subtitle}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `2px solid ${t.rule}`,
          paddingTop: 28,
          fontFamily: "monospace",
          fontSize: 22,
          color: t.muted,
        }}
      >
        <span>Uzair Vawda</span>
        <span>uzairvawda.me</span>
      </div>
    </div>
  );
}
