import type { NextConfig } from "next";

// Security headers applied to every route.
//
// CSP is intentionally conservative but allows the inline scripts/styles
// that Next.js + Tailwind require for hydration. A stricter nonce-based
// CSP is a future tighten (would require middleware to inject the nonce
// into every script tag).
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const permissionsPolicy = [
  "accelerometer=()",
  "autoplay=()",
  "camera=()",
  "geolocation=()",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "payment=()",
  "usb=()",
].join(", ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: permissionsPolicy },
  // Vercel sets Strict-Transport-Security automatically on uzairvawda.me.
];

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF (smallest) with a WebP fallback. next/image picks the
    // best format the requesting browser supports and resizes to the
    // displayed dimensions, so the profile photo ships as ~20-40KB.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
