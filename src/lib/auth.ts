import { supabase } from "@/integrations/supabase/client";

const UNLOCKED_KEY = "sunnyfi-unlocked";

export function isUnlocked(): boolean {
  try { return sessionStorage.getItem(UNLOCKED_KEY) === "1"; } catch { return false; }
}

export function lockSession(): void {
  try { sessionStorage.removeItem(UNLOCKED_KEY); } catch { /* */ }
}

export async function tryPasscode(passcode: string): Promise<
  | { ok: true }
  | { ok: false; reason: "bad_passcode" | "rate_limited" | "network" | "unknown" }
> {
  try {
    const { data, error } = await supabase.functions.invoke("sunnyfi-auth", {
      body: { passcode },
    });

    if (error) {
      // supabase-js throws FunctionsHttpError for non-2xx. The status is on the
      // underlying response — parse context we can see on the error object.
      const status =
        (error as { context?: { status?: number } }).context?.status ??
        (error as { status?: number }).status ??
        0;
      if (status === 429) return { ok: false, reason: "rate_limited" };
      if (status === 401) return { ok: false, reason: "bad_passcode" };
      return { ok: false, reason: "unknown" };
    }

    if (data && (data as { ok?: boolean }).ok) {
      try { sessionStorage.setItem(UNLOCKED_KEY, "1"); } catch { /* */ }
      return { ok: true };
    }
    return { ok: false, reason: "bad_passcode" };
  } catch {
    return { ok: false, reason: "network" };
  }
}
