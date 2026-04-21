import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_PUBLISHABLE_KEY!);
const { data, error, count } = await sb.from("reports").select("id, title, created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(5);
if (error) throw error;
console.log(`Total rows: ${count}`);
console.log("Most recent 5:");
for (const r of data ?? []) console.log(`  ${r.created_at}  ${r.id.slice(0,8)}  ${r.title}`);
