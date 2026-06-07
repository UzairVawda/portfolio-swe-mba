import "server-only";

import { createClient } from "@supabase/supabase-js";

import { requireEnv } from "@/lib/env";

// Service-role client. Never import this file from a client component.
// The service role key bypasses RLS, which is required for our API
// route to insert into contact_submissions.
export function getServiceSupabase() {
  // Sanitize the URL: a trailing slash or stray whitespace produces a
  // "//rest/v1/..." request path that PostgREST rejects with
  // PGRST125 ("Invalid path specified in request URL").
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL").trim().replace(/\/+$/, "");
  return createClient(url, requireEnv("SUPABASE_SERVICE_ROLE_KEY").trim(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
