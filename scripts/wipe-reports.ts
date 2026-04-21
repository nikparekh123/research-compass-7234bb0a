// One-shot: delete all rows from `reports` and all files in the `reports` bucket.
// Run with: bun run scripts/wipe-reports.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY in .env");

const sb = createClient(url, key);

// 1. Gather file_paths so we can remove storage objects.
const { data: rows, error: fetchErr } = await sb.from("reports").select("id, file_path");
if (fetchErr) throw fetchErr;
console.log(`Found ${rows?.length ?? 0} reports.`);

const paths = (rows ?? []).map((r) => r.file_path).filter((p): p is string => !!p);
if (paths.length) {
  const { error: rmErr } = await sb.storage.from("reports").remove(paths);
  if (rmErr) console.error("Storage remove error:", rmErr);
  else console.log(`Removed ${paths.length} storage files.`);
}

// 2. Also list everything in the bucket root and remove (in case of orphans).
const { data: listed, error: listErr } = await sb.storage.from("reports").list("", { limit: 1000 });
if (listErr) console.error("List error:", listErr);
else if (listed && listed.length) {
  const orphans = listed.map((o) => o.name).filter((n) => !paths.includes(n));
  if (orphans.length) {
    const { error } = await sb.storage.from("reports").remove(orphans);
    if (error) console.error("Orphan remove error:", error);
    else console.log(`Removed ${orphans.length} orphan storage files.`);
  }
}

// 3. Delete all rows.
const { error: delErr, count } = await sb
  .from("reports")
  .delete({ count: "exact" })
  .not("id", "is", null);
if (delErr) throw delErr;
console.log(`Deleted ${count ?? 0} rows from reports.`);
