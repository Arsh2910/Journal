import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createChallenge } from "../services/challengeApi";

const DURATIONS = [30, 50, 75, 100];

// Get today's date in local timezone (YYYY-MM-DD)
// Using toISOString() returns UTC — wrong for IST/UTC+ users before midnight UTC.
function getLocalToday() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days - 1);
  return d;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function CreateChallenge() {
  const navigate = useNavigate();
  const today = getLocalToday();

  const [duration, setDuration]   = useState(100);
  const [custom, setCustom]       = useState("");
  const [isCustom, setIsCustom]   = useState(false);
  const [intention, setIntention] = useState(""); // UI only — not sent to backend
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  const effectiveDuration = isCustom ? parseInt(custom, 10) || 0 : duration;

  const endDate = useMemo(() => {
    if (effectiveDuration < 1) return null;
    return addDays(today, effectiveDuration);
  }, [today, effectiveDuration]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (effectiveDuration < 1) {
      setError("Please choose a valid duration.");
      return;
    }
    setLoading(true);
    try {
      await createChallenge(today, effectiveDuration);
      navigate("/journal");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background desk-texture py-16 px-4">
      <div className="max-w-2xl mx-auto space-y-12" style={{ animation: "fade-in 0.4s ease-out" }}>
        {/* Header */}
        <div className="space-y-3">
          <p className="stamp-label text-primary">New Challenge</p>
          <h1 className="font-serif text-display-lg text-secondary-fixed" style={{ letterSpacing: "-0.02em" }}>
            Begin Your<br />
            <span className="italic">Journey</span>
          </h1>
          <div className="w-16 h-px bg-outline-variant/50" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Duration picker */}
          <div className="space-y-4">
            <p className="stamp-label">Duration</p>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => { setDuration(d); setIsCustom(false); }}
                  className={`font-sans text-label-md uppercase tracking-widest px-5 py-2 border transition-all duration-200
                    ${!isCustom && duration === d
                      ? "border-secondary bg-secondary-container text-secondary"
                      : "border-outline-variant text-on-surface-variant hover:border-outline"
                    }`}
                >
                  {d} days
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className={`font-sans text-label-md uppercase tracking-widest px-5 py-2 border transition-all duration-200
                  ${isCustom
                    ? "border-secondary bg-secondary-container text-secondary"
                    : "border-outline-variant text-on-surface-variant hover:border-outline"
                  }`}
              >
                Custom
              </button>
            </div>

            {isCustom && (
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="number"
                  min="1"
                  max="365"
                  autoFocus
                  className="ink-input w-28 text-center"
                  placeholder="e.g. 21"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                />
                <span className="stamp-label">days</span>
              </div>
            )}
          </div>

          {/* Start date — locked to today (backend enforces) */}
          <div className="space-y-2">
            <p className="stamp-label">Start Date</p>
            <div className="flex items-center gap-3">
              <p className="font-serif text-body-md text-on-surface">
                {formatDate(today)}
              </p>
              <span className="stamp-label text-outline">(Today — challenges must start today)</span>
            </div>
          </div>

          {/* Intention — UI only, not sent to backend */}
          <div className="space-y-2">
            <p className="stamp-label">
              Intention <span className="text-outline normal-case font-normal" style={{ letterSpacing: 0 }}>(optional — stays in your browser)</span>
            </p>
            <input
              type="text"
              className="ink-input"
              placeholder="Why are you starting this challenge?"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
            />
          </div>

          {/* Preview */}
          {effectiveDuration > 0 && endDate && (
            <div className="journal-paper p-6 space-y-4 paper-texture">
              <p className="stamp-label text-primary">Challenge Preview</p>
              <div className="space-y-1">
                <p className="font-serif text-headline-lg text-secondary-fixed">
                  {effectiveDuration} <span className="text-on-surface-variant text-headline-md">days</span>
                </p>
                <p className="font-sans text-label-md text-on-surface-variant">
                  {formatDate(today)} → {formatDate(endDate)}
                </p>
                <p className="font-serif italic text-on-surface-variant text-body-md mt-2">
                  Your journal will have {effectiveDuration} pages.
                </p>
              </div>
              {intention && (
                <blockquote className="border-l-2 border-tertiary/40 pl-4 mt-4">
                  <p className="font-serif italic text-tertiary text-body-md">"{intention}"</p>
                </blockquote>
              )}
            </div>
          )}

          {error && (
            <p className="font-sans text-label-sm text-error border-l-2 border-error pl-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || effectiveDuration < 1}
            className="btn-embossed flex items-center gap-3 group disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Opening your journal..." : "Begin My Challenge"}
            <span className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
          </button>
        </form>
      </div>
    </div>
  );
}
