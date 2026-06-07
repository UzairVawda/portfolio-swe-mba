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

  // hashIp + getServiceSupabase read required env vars and THROW if any
  // is missing. Without this guard a missing var surfaces as an opaque
  // 500 with an empty body — impossible to diagnose from the client.
  // Catch it here so the failure is logged with the exact variable name.
  let ipHash: string;
  let supabase: ReturnType<typeof getServiceSupabase>;
  try {
    ipHash = hashIp(getClientIp(request.headers));
    supabase = getServiceSupabase();
  } catch (configError) {
    console.error("[contact] server misconfigured", configError);
    return NextResponse.json(
      { error: "Server is misconfigured. Please try again later." },
      { status: 500 },
    );
  }

  const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? null;

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

  // The row is already saved, so email failures never fail the request.
  // Fire both emails independently: the visitor's confirmation should go
  // out even if the self-notification hiccups, and vice versa.
  try {
    const resend = getResend();
    const fromEmail = requireEnv("RESEND_FROM_EMAIL");
    const firstName = data.name.trim().split(/\s+/)[0];

    const results = await Promise.allSettled([
      // 1. Notify me of the new message.
      resend.emails.send({
        from: fromEmail,
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
      }),
      // 2. Auto-reply confirming receipt to the person who wrote in.
      resend.emails.send({
        from: fromEmail,
        to: data.email,
        replyTo: requireEnv("CONTACT_TO_EMAIL"),
        subject: `Thanks for reaching out, ${firstName}`,
        text: [
          `Hi ${firstName},`,
          "",
          "Thanks for reaching out through my site — I really appreciate you taking the time to connect. Your message came through, and I'll get back to you as quickly as I can.",
          "",
          "In the meantime, feel free to explore more:",
          "  Portfolio: https://uzairvawda.me",
          "  LinkedIn:  https://www.linkedin.com/in/uzair-vawda/",
          "  GitHub:    https://github.com/UzairVawda",
          "",
          "Talk soon,",
          "Uzair Vawda",
        ].join("\n"),
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;max-width:480px;">
            <p>Hi ${firstName},</p>
            <p>Thanks for reaching out through my site — I really appreciate you taking the time to connect. Your message came through, and I'll get back to you as quickly as I can.</p>
            <p style="margin-bottom:6px;">In the meantime, feel free to explore more:</p>
            <p style="margin-top:0;">
              <a href="https://uzairvawda.me" style="color:#2563eb;text-decoration:none;">Portfolio</a>
              &nbsp;·&nbsp;
              <a href="https://www.linkedin.com/in/uzair-vawda/" style="color:#2563eb;text-decoration:none;">LinkedIn</a>
              &nbsp;·&nbsp;
              <a href="https://github.com/UzairVawda" style="color:#2563eb;text-decoration:none;">GitHub</a>
            </p>
            <p style="margin-bottom:0;">Talk soon,<br>Uzair Vawda</p>
          </div>
        `,
      }),
    ]);

    results.forEach((result, i) => {
      if (result.status === "rejected") {
        const which = i === 0 ? "notification" : "auto-reply";
        console.error(`[contact] ${which} email failed`, result.reason);
      }
    });
  } catch (emailError) {
    console.error("[contact] email layer failed", emailError);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
