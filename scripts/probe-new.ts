// Verify the new Supabase project has the reports table and reports bucket.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEW_URL!;
const key = process.env.NEW_KEY!;
const sb = createClient(url, key);

console.log(`Probing ${url}…`);

const t = await sb.from("reports").select("id", { count: "exact", head: true });
console.log("reports table:", t.error ? `❌ ${t.error.message}` : `✅ exists, ${t.count ?? 0} rows`);

const b = await sb.storage.from("reports").list("", { limit: 1 });
console.log("reports bucket:", b.error ? `❌ ${b.error.message}` : `✅ exists, ${b.data?.length ?? 0} sample files`);

// Test insert + delete to verify RLS policies
const ins = await sb.from("reports").insert({
  title: "PROBE — delete me",
  report_type: "single",
  visibility: "Team",
  tickers: ["PROBE"],
}).select("id").single();
if (ins.error) {
  console.log("RLS insert: ❌", ins.error.message);
} else {
  console.log("RLS insert: ✅");
  await sb.from("reports").delete().eq("id", ins.data.id);
  console.log("RLS delete: ✅");
}
