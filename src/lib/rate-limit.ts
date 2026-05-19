import "server-only";

import { createHmac } from "node:crypto";

import { requireEnv } from "@/lib/env";

// Hash an IP with a server-side secret so we can rate-limit without
// storing the raw IP. Same input always produces the same hash; the
// secret prevents reversing the hash back to the IP.
export function hashIp(ip: string): string {
  return createHmac("sha256", requireEnv("RATE_LIMIT_SECRET"))
    .update(ip)
    .digest("hex");
}

export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "0.0.0.0"
  );
}
