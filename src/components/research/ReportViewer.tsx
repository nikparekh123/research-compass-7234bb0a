import { useEffect, useState } from "react";
import { fetchReportHtml, type ReportRow } from "@/lib/research";

interface Props {
  report: ReportRow | null;
  onClose: () => void;
}

export default function ReportViewer({ report, onClose }: Props) {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!report) { setHtml(null); setError(null); return; }
    setLoading(true);
    setError(null);
    setHtml(null);
    let cancelled = false;
    fetchReportHtml(report.file_path)
      .then((h) => { if (!cancelled) setHtml(h); })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : "Couldn't load report"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [report]);

  useEffect(() => {
    if (!report) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [report, onClose]);

  if (!report) return null;

  return (
    <div className="rv-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="rv-panel" onClick={(e) => e.stopPropagation()}>
        <div className="rv-head">
          <div className="rv-meta">
            <span className="rv-ticker">{report.tickers[0] ?? report.typ.toUpperCase()}</span>
            <span className="rv-title">{report.title}</span>
          </div>
          <div className="rv-spacer" />
          <span className="rv-sub">
            {report.author} <span className="up-sep">·</span> {report.d} <span className="up-sep">·</span> {report.read}
          </span>
          <button className="up-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="rv-body">
          {loading && <div className="rv-status">Loading…</div>}
          {error && <div className="rv-status rv-error">{error}</div>}
          {html && (
            <iframe
              className="rv-frame"
              title={report.title}
              srcDoc={html}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          )}
        </div>
      </div>
    </div>
  );
}
