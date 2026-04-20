export type ReportType = "single" | "macro" | "theme" | "earn";
export type SectorKey = "tech" | "energy" | "fin" | "hlth" | "macro" | "indu" | "stpl";
export type FreshState = "new" | "unread" | "read";
export type Visibility = "Team" | "Firm-wide" | "Private";

export interface Report {
  d: string;
  tickers: string[];
  typ: ReportType;
  sec: SectorKey;
  sectors: string[];
  title: string;
  author: string;
  read: string;
  star: boolean;
  fresh: FreshState;
  tags: string[];
  summary: string;
  visibility: Visibility;
}

export type ViewKey = "latest" | "sector" | "author" | "type" | "starred";

export const typeLabel: Record<ReportType, string> = {
  single: "Single",
  macro: "Macro",
  theme: "Theme",
  earn: "Earnings",
};

export const secLabel: Record<SectorKey, string> = {
  tech: "Technology",
  energy: "Energy",
  fin: "Financials",
  hlth: "Healthcare",
  macro: "Macro",
  indu: "Industrials",
  stpl: "Staples",
};

const seed = (r: Omit<Report, "sectors" | "tags" | "summary" | "visibility">): Report => ({
  ...r, sectors: [secLabel[r.sec]], tags: [], summary: "", visibility: "Team",
});

export const SEED_REPORTS: Report[] = [
  seed({ d: "Apr 18", tickers: ["AAPL"], typ: "single", sec: "tech",   title: "Apple — services margin expansion vs. HW cycle drag",        author: "M. Chen", read: "12m", star: true,  fresh: "new" }),
  seed({ d: "Apr 18", tickers: [],       typ: "macro",  sec: "macro",  title: "Fed balance sheet runoff — tapering the taper",              author: "R. Park", read: "8m",  star: false, fresh: "new" }),
  seed({ d: "Apr 18", tickers: ["XOM"],  typ: "single", sec: "energy", title: "Exxon — Permian capex discipline into Q2",                   author: "L. Díaz", read: "14m", star: true,  fresh: "new" }),
  seed({ d: "Apr 17", tickers: [],       typ: "theme",  sec: "tech",   title: "Edge-inference silicon — winners beyond NVDA",               author: "S. Alvi", read: "21m", star: false, fresh: "new" }),
  seed({ d: "Apr 17", tickers: ["JPM"],  typ: "earn",   sec: "fin",    title: "JPMorgan 1Q26 — NII guide, card charge-offs inflecting",     author: "M. Chen", read: "9m",  star: false, fresh: "unread" }),
  seed({ d: "Apr 17", tickers: ["CVX"],  typ: "single", sec: "energy", title: "Chevron — Hess arbitration overhang quantified",             author: "L. Díaz", read: "11m", star: false, fresh: "unread" }),
  seed({ d: "Apr 16", tickers: [],       typ: "macro",  sec: "macro",  title: "USD wrecking ball — EM pain thresholds",                     author: "R. Park", read: "15m", star: true,  fresh: "unread" }),
  seed({ d: "Apr 16", tickers: ["MSFT"], typ: "single", sec: "tech",   title: "Microsoft — Azure AI capacity build vs. GM compression",     author: "S. Alvi", read: "18m", star: false, fresh: "unread" }),
  seed({ d: "Apr 15", tickers: ["GS"],   typ: "earn",   sec: "fin",    title: "Goldman — FICC beat, IB pipeline commentary",                author: "M. Chen", read: "10m", star: false, fresh: "read" }),
  seed({ d: "Apr 15", tickers: [],       typ: "theme",  sec: "fin",    title: "Regional banks — CRE maturity wall mapping",                 author: "M. Chen", read: "24m", star: false, fresh: "read" }),
  seed({ d: "Apr 14", tickers: ["NVDA"], typ: "single", sec: "tech",   title: "Nvidia — Blackwell ramp, hyperscaler allocation",            author: "S. Alvi", read: "19m", star: true,  fresh: "read" }),
  seed({ d: "Apr 14", tickers: [],       typ: "macro",  sec: "macro",  title: "China credit impulse — is the floor in?",                    author: "R. Park", read: "13m", star: false, fresh: "read" }),
  seed({ d: "Apr 11", tickers: ["SLB"],  typ: "single", sec: "energy", title: "Schlumberger — int’l offshore cycle, margin path",           author: "L. Díaz", read: "12m", star: false, fresh: "read" }),
  seed({ d: "Apr 11", tickers: ["BAC"],  typ: "earn",   sec: "fin",    title: "Bank of America — deposit beta peak?",                       author: "M. Chen", read: "9m",  star: false, fresh: "read" }),
  seed({ d: "Apr 10", tickers: [],       typ: "theme",  sec: "tech",   title: "Humanoid robotics stack — Q2 capex readthrough",             author: "S. Alvi", read: "22m", star: false, fresh: "read" }),
  seed({ d: "Apr 10", tickers: ["UNH"],  typ: "single", sec: "hlth",   title: "UnitedHealth — MLR pressure + Optum Rx tailwind",            author: "M. Chen", read: "14m", star: false, fresh: "read" }),
];

export const SECTORS: { k: SectorKey | "all"; label: string; count: number }[] = [
  { k: "all",    label: "All",         count: 168 },
  { k: "tech",   label: "Technology",  count: 42 },
  { k: "energy", label: "Energy",      count: 31 },
  { k: "fin",    label: "Financials",  count: 38 },
  { k: "hlth",   label: "Healthcare",  count: 22 },
  { k: "macro",  label: "Macro",       count: 19 },
  { k: "indu",   label: "Industrials", count: 9 },
  { k: "stpl",   label: "Staples",     count: 7 },
];

export const TYPES: { k: ReportType | "all"; label: string; count: number }[] = [
  { k: "all",    label: "All",          count: 168 },
  { k: "single", label: "Single-stock", count: 84 },
  { k: "macro",  label: "Macro",        count: 41 },
  { k: "theme",  label: "Thematic",     count: 23 },
  { k: "earn",   label: "Earnings",     count: 20 },
];

export const RECENCY = [
  { k: "1d",  label: "Today",      count: 6 },
  { k: "7d",  label: "This week",  count: 24 },
  { k: "30d", label: "This month", count: 71 },
  { k: "90d", label: "This qtr",   count: 168 },
];

export const VIEWS: { k: ViewKey; label: string; count: number | null }[] = [
  { k: "latest",  label: "Latest",    count: 168 },
  { k: "sector",  label: "By sector", count: null },
  { k: "author",  label: "By author", count: null },
  { k: "type",    label: "By type",   count: null },
  { k: "starred", label: "Starred",   count: 12 },
];

export interface Group<T extends Report = Report> {
  key: string;
  title: string | null;
  items: T[];
}

export function groupRows<T extends Report>(rows: T[], view: ViewKey): Group<T>[] {
  if (view === "latest") return [{ key: "_", title: null, items: rows }];
  if (view === "starred") return [{ key: "starred", title: null, items: rows.filter((r) => r.star) }];
  if (view === "sector") {
    const order: SectorKey[] = ["tech", "energy", "fin", "macro", "hlth"];
    return order
      .map((k) => ({ key: k, title: secLabel[k] || k, items: rows.filter((r) => r.sec === k) }))
      .filter((g) => g.items.length);
  }
  if (view === "author") {
    const authors = [...new Set(rows.map((r) => r.author))].sort();
    return authors.map((a) => ({ key: a, title: a, items: rows.filter((r) => r.author === a) }));
  }
  if (view === "type") {
    const order: ReportType[] = ["single", "macro", "theme", "earn"];
    return order
      .map((k) => ({ key: k, title: typeLabel[k], items: rows.filter((r) => r.typ === k) }))
      .filter((g) => g.items.length);
  }
  return [{ key: "_", title: null, items: rows }];
}

// ---------- Supabase mapping ----------
import { supabase } from "@/integrations/supabase/client";

type DbReport = {
  id: string;
  title: string;
  tickers: string[] | null;
  report_type: string;
  primary_sector: string | null;
  sectors: string[] | null;
  author: string | null;
  published_at: string | null;
  read_minutes: number | null;
  tags: string[] | null;
  summary: string | null;
  visibility: string;
  file_path: string | null;
  starred: boolean;
  created_at: string;
};

const sectorKeyFromLabel = (s?: string | null): SectorKey => {
  const v = (s || "").toLowerCase();
  if (v.startsWith("tech")) return "tech";
  if (v.startsWith("energ")) return "energy";
  if (v.startsWith("financ") || v === "fin") return "fin";
  if (v.startsWith("health") || v === "hlth") return "hlth";
  if (v.startsWith("macro")) return "macro";
  if (v.startsWith("indu")) return "indu";
  if (v.startsWith("stap") || v === "stpl") return "stpl";
  return "tech";
};

const formatShortDate = (iso: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", { month: "short", day: "numeric" });
};

export interface ReportRow extends Report {
  id: string;
}

export function dbToReport(r: DbReport): ReportRow {
  const typ = (["single", "macro", "theme", "earn"].includes(r.report_type) ? r.report_type : "single") as ReportType;
  const sec = sectorKeyFromLabel(r.primary_sector);
  return {
    id: r.id,
    d: formatShortDate(r.published_at || r.created_at),
    tickers: r.tickers || [],
    typ,
    sec,
    sectors: r.sectors && r.sectors.length ? r.sectors : [secLabel[sec]],
    title: r.title,
    author: r.author || "—",
    read: (r.read_minutes ?? 10) + "m",
    star: !!r.starred,
    fresh: "read",
    tags: r.tags || [],
    summary: r.summary || "",
    visibility: (["Team", "Firm-wide", "Private"].includes(r.visibility) ? r.visibility : "Team") as Visibility,
  };
}

export async function fetchReports(): Promise<ReportRow[]> {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as DbReport[]).map(dbToReport);
}

const SEED_AUTHOR_DATES: Record<string, string> = {
  "Apr 18": "2026-04-18", "Apr 17": "2026-04-17", "Apr 16": "2026-04-16",
  "Apr 15": "2026-04-15", "Apr 14": "2026-04-14", "Apr 11": "2026-04-11", "Apr 10": "2026-04-10",
};

export async function seedReportsIfEmpty(): Promise<boolean> {
  const { count, error } = await supabase
    .from("reports")
    .select("id", { count: "exact", head: true });
  if (error) throw error;
  if ((count ?? 0) > 0) return false;

  const rows = SEED_REPORTS.map((r) => ({
    title: r.title,
    tickers: r.tickers,
    report_type: r.typ,
    primary_sector: secLabel[r.sec],
    sectors: r.sectors,
    author: r.author,
    published_at: SEED_AUTHOR_DATES[r.d] || new Date().toISOString().slice(0, 10),
    read_minutes: parseInt(r.read, 10) || 10,
    tags: r.tags,
    summary: r.summary,
    visibility: r.visibility,
    starred: r.star,
  }));
  const { error: insErr } = await supabase.from("reports").insert(rows);
  if (insErr) throw insErr;
  return true;
}

