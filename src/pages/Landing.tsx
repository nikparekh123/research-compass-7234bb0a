import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isUnlocked, tryPasscode } from "@/lib/auth";

function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function formatClock(date: Date, offsetHours: number) {
  const utcMs = date.getTime() + date.getTimezoneOffset() * 60_000;
  const local = new Date(utcMs + offsetHours * 3_600_000);
  const h = local.getHours().toString().padStart(2, "0");
  const m = local.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

export default function Landing() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fading, setFading] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const now = useNow();
  const nyc = formatClock(now, -4);

  // Already unlocked? Skip straight to dashboard.
  useEffect(() => { if (isUnlocked()) navigate("/dashboard", { replace: true }); }, [navigate]);

  // Autofocus first digit
  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  // Auto-submit once all 4 filled
  useEffect(() => {
    if (!digits.every((d) => d !== "")) return;
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const code = digits.join("");

    tryPasscode(code).then((res) => {
      if (res.ok) {
        setFading(true);
        setTimeout(() => navigate("/dashboard", { replace: true }), 400);
        return;
      }
      // Reset + explain
      if (res.reason === "rate_limited") setError("Too many attempts — try again in a few minutes.");
      else if (res.reason === "network") setError("Can't reach the server.");
      else setError("That's not the passcode.");
      setDigits(["", "", "", ""]);
      setSubmitting(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 0);
    });
  }, [digits, submitting, navigate]);

  const handleChange = (i: number, v: string) => {
    const ch = v.slice(-1).replace(/[^0-9]/g, "");
    if (!ch && v !== "") return;
    const next = [...digits];
    next[i] = ch;
    setDigits(next);
    if (ch && i < 3) inputRefs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  return (
    <div className={"app" + (fading ? " fading" : "")}>
      <div className="landing">
        <div className="landing-top">
          <div className="wordmark">Sunnyfi<span className="cursor" /></div>
          <div className="landing-meta">
            <span className="mono">{nyc}</span>
            <span className="meta-sep">·</span>
            <span>NYC</span>
          </div>
        </div>

        <div className="landing-hero">
          <div className="welcome-big">
            Welcome to<br />
            Sunny Wealth<br />
            Management.
          </div>
        </div>

        <div className="landing-foot">
          <div className="footer-tools">
            <span className="label">Tools</span>
            <a className="tool-dot" href="https://todos.sunnyfi.co">Tasks</a>
            <span className="tool-dot">Research Hub</span>
            <span className="tool-dot soon">+4 more</span>
          </div>

          <div className="passcode">
            <div className="passcode-label">Passcode</div>
            <div className="passcode-inputs">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  className="passcode-input"
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  placeholder=" "
                  aria-label={`Passcode digit ${i + 1}`}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKey(i, e)}
                  disabled={submitting}
                />
              ))}
            </div>
            <div className="passcode-hint">
              {error ? error : "Enter 4-digit passcode ↵"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
