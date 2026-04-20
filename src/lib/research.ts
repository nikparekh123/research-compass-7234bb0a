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

export const REPORTS: Report[] = [
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

export interface Group {
  key: string;
  title: string | null;
  items: Report[];
}

export function groupRows(rows: Report[], view: ViewKey): Group[] {
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
