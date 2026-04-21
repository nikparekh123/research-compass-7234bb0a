import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_PUBLISHABLE_KEY!);

const { data, error } = await sb.from("reports").select("id, title, file_path").not("file_path", "is", null).limit(5);
if (error) throw error;
if (!data?.length) { console.log("No reports with file_path yet."); process.exit(0); }

for (const r of data) {
  const url = sb.storage.from("reports").getPublicUrl(r.file_path!).data.publicUrl;
  const head = await fetch(url, { method: "HEAD" });
  console.log(r.file_path);
  console.log("  url:", url);
  console.log("  status:", head.status);
  console.log("  content-type:", head.headers.get("content-type"));
  console.log("  content-disposition:", head.headers.get("content-disposition"));
}
