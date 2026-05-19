import { NextResponse } from "next/server";

import { requireEnv } from "@/lib/env";
import { getClientIp, hashIp } from "@/lib/rate-limit";
import { getResend } from "@/lib/resend";
import { getServiceSupabase } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validation/contact";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_SECONDS = 60;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const ip = getClientIp(request.headers);
  const ipHash = hashIp(ip);
  const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? null;

  const supabase = getServiceSupabase();

  // Per-IP rate limit. One submission per minute is generous for a
  // real human and harsh on scripts.
  const since = new Date(
    Date.now() - RATE_LIMIT_WINDOW_SECONDS * 1000,
  ).toISOString();

  const { data: recent, error: rateError } = await supabase
    .from("contact_submissions")
    .select("id")
    .eq("ip_hash", ipHash)
    .gte("created_at", since)
    .limit(1);

  if (rateError) {
    console.error("[contact] rate-limit query failed", rateError);
    return NextResponse.json(
      { error: "Could not process request" },
      { status: 500 },
    );
  }

  if (recent && recent.length > 0) {
    return NextResponse.json(
      {
        error: "Too many submissions",
        message:
          "You sent a message in the last minute. Wait a bit, then try again.",
      },
      { status: 429 },
    );
  }

  const { error: insertError } = await supabase
    .from("contact_submissions")
    .insert({
      name: data.name,
      email: data.email,
      message: data.message,
      role: data.role || null,
      reason: data.reason || null,
      source: data.source,
      ip_hash: ipHash,
      user_agent: userAgent,
    });

  if (insertError) {
    console.error("[contact] insert failed", insertError);
    return NextResponse.json(
      { error: "Could not save message" },
      { status: 500 },
    );
  }

  try {
    const resend = getResend();
    await resend.emails.send({
      from: requireEnv("RESEND_FROM_EMAIL"),
      to: requireEnv("CONTACT_TO_EMAIL"),
      replyTo: data.email,
      subject: `[${data.source}] New message from ${data.name}`,
      text: [
        `From:    ${data.name} <${data.email}>`,
        data.role ? `Role:    ${data.role}` : null,
        data.reason ? `Reason:  ${data.reason}` : null,
        `Source:  ${data.source}`,
        "",
        data.message,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (emailError) {
    // Row is already saved, so do not fail the request for the user.
    // The submission survives even if the email layer hiccups.
    console.error("[contact] email send failed", emailError);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
