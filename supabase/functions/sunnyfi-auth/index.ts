// Edge function: verify the Sunnyfi landing passcode.
//
// Deploy via the Supabase Dashboard:
//   1. Database → Edge Functions → Deploy new function
//   2. Name: sunnyfi-auth
//   3. Paste this file's contents
//   4. In Secrets, add: SUNNYFI_PASSCODE = "1234"  (pick your own 4 digits)
//
// The function also soft-rate-limits: after 10 failed attempts from a single
// IP in 5 minutes, it returns 429 until the window rolls over. The table
// `public.passcode_attempts` must exist (see the accompanying migration).
//
// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST")    return json({ ok: false, error: "method" }, 405);

  const passcodeSecret = Deno.env.get("SUNNYFI_PASSCODE");
  if (!passcodeSecret) return json({ ok: false, error: "server_not_configured" }, 500);

  let body: { passcode?: string } = {};
  try { body = await req.json(); } catch { /* */ }
  const attempt = (body.passcode || "").toString().trim();
  if (!/^\d{4}$/.test(attempt)) return json({ ok: false, error: "bad_format" }, 400);

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // Rate limit: 10 failed attempts per IP per 5 minutes.
  const windowStart = new Date(Date.now() - 5 * 60_000).toISOString();
  const { count, error: countErr } = await sb
    .from("passcode_attempts")
    .select("id", { count: "exact", head: true })
    .eq("ip", ip)
    .eq("ok", false)
    .gte("created_at", windowStart);

  if (!countErr && (count ?? 0) >= 10) {
    return json({ ok: false, error: "rate_limited" }, 429);
  }

  const ok = attempt === passcodeSecret;
  // Log the attempt (fire-and-forget, non-blocking)
  sb.from("passcode_attempts").insert({ ip, ok }).then(() => {}).catch(() => {});

  if (!ok) return json({ ok: false, error: "bad_passcode" }, 401);
  return json({ ok: true });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...cors },
  });
}
