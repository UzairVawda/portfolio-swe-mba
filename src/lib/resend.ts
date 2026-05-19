import "server-only";

import { Resend } from "resend";

import { requireEnv } from "@/lib/env";

let cached: Resend | undefined;

export function getResend() {
  if (!cached) {
    cached = new Resend(requireEnv("RESEND_API_KEY"));
  }
  return cached;
}
