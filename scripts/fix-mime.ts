// Delete + re-upload each file so storage picks up the new text/html content-type.
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_PUBLISHABLE_KEY!);

const { data: rows, error } = await sb.from("reports").select("id, file_path").not("file_path", "is", null);
if (error) throw error;

for (const r of rows ?? []) {
  const path = r.file_path!;
  console.log(`\n${path}`);

  const dl = await sb.storage.from("reports").download(path);
  if (dl.error) { console.error("  download failed:", dl.error); continue; }
  const bytes = new Uint8Array(await dl.data.arrayBuffer());
  console.log(`  bytes: ${bytes.length}`);

  const rm = await sb.storage.from("reports").remove([path]);
  if (rm.error) { console.error("  remove failed:", rm.error); continue; }

  const blob = new Blob([bytes], { type: "text/html" });
  const up = await sb.storage.from("reports").upload(path, blob, { contentType: "text/html", upsert: false });
  if (up.error) { console.error("  upload failed:", up.error); continue; }

  const url = sb.storage.from("reports").getPublicUrl(path).data.publicUrl;
  const head = await fetch(url, { method: "HEAD", cache: "no-store" });
  console.log(`  new content-type: ${head.headers.get("content-type")}`);
}
console.log("\nDone.");
