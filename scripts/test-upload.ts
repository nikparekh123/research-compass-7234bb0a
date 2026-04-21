// Smoke test: upload an HTML file to the `reports` bucket and insert a row.
// Run with: bun run scripts/test-upload.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL!;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;
const sb = createClient(url, key);

const html = "<!doctype html><title>Smoke test</title><h1>Hello from scripts/test-upload.ts</h1>";
const path = `${crypto.randomUUID()}.html`;

console.log("Uploading to storage…");
const up = await sb.storage.from("reports").upload(path, new Blob([html], { type: "text/html" }), {
  contentType: "text/html", upsert: false,
});
if (up.error) { console.error("Upload FAIL:", up.error); process.exit(1); }
console.log("  ok:", up.data);

console.log("Inserting row…");
const ins = await sb.from("reports").insert({
  title: "Smoke test — please delete",
  tickers: ["TEST"],
  report_type: "single",
  primary_sector: "Technology",
  sectors: ["Technology"],
  author: "script",
  published_at: new Date().toISOString().slice(0, 10),
  read_minutes: 3,
  tags: ["smoke"],
  summary: "",
  visibility: "Team",
  file_path: path,
  starred: false,
}).select("id").single();
if (ins.error) { console.error("Insert FAIL:", ins.error); process.exit(1); }
console.log("  ok, row id:", ins.data.id);

console.log("Reading it back…");
const { data, error } = await sb.from("reports").select("id, title, file_path").eq("id", ins.data.id).single();
if (error) { console.error("Read FAIL:", error); process.exit(1); }
console.log("  ok:", data);

console.log("\nCleaning up…");
await sb.from("reports").delete().eq("id", ins.data.id);
await sb.storage.from("reports").remove([path]);
console.log("  done.");

console.log("\n✅ Upload end-to-end works.");
