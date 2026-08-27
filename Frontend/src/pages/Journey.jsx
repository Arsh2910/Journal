import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useChallenge } from "../hooks/useChallenge";
import { getProgress, getDayMap } from "../services/progressApi";
import JourneyGrid from "../components/JourneyGrid";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days - 1);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function Journey() {
  const { challenge, currentDay, loading: cLoading } = useChallenge();
  const [progress, setProgress] = useState(null);
  const [days, setDays]         = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!challenge) return;
    (async () => {
      setLoading(true);
      try {
        const [prog, dayMap] = await Promise.all([getProgress(), getDayMap()]);
        setProgress(prog);
        setDays(dayMap.days || []);
      } catch (err) {
        console.error("Progress error:", err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [challenge]);

  if (cLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="turning-page">Reviewing your journey...</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 text-center px-4">
        <p className="font-serif text-headline-md text-secondary">No active challenge.</p>
        <Link to="/create" className="btn-embossed">Begin a Challenge</Link>
      </div>
    );
  }

  const endDate = addDays(challenge.startDate, challenge.duration);

  return (
    <div className="min-h-screen bg-background desk-texture py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-12" style={{ animation: "fade-in 0.4s ease-out" }}>
        {/* Header */}
        <div className="space-y-3">
          <p className="stamp-label text-primary">Your Journey</p>
          <h1 className="font-serif text-display-lg text-secondary-fixed" style={{ letterSpacing: "-0.02em" }}>
            {currentDay} <span className="text-on-surface-variant text-headline-lg">of {challenge.duration}</span>
          </h1>
          <div className="w-16 h-px bg-outline-variant/50" />
        </div>

        {/* Stats row */}
        {progress && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="stat-card">
              <p className="stamp-label text-outline">Documented</p>
              <p className="font-serif text-headline-lg text-primary mt-2">
                {progress.completedDays}
              </p>
              <p className="stamp-label text-on-surface-variant mt-1">days</p>
            </div>
            <div className="stat-card">
              <p className="stamp-label text-outline">Progress</p>
              <p className="font-serif text-headline-lg text-secondary mt-2">
                {progress.progress}%
              </p>
              <p className="stamp-label text-on-surface-variant mt-1">completed</p>
            </div>
            <div className="stat-card">
              <p className="stamp-label text-outline">Missed</p>
              <p className="font-serif text-headline-lg text-tertiary/70 mt-2">
                {progress.missedDays}
              </p>
              <p className="stamp-label text-on-surface-variant mt-1">days</p>
            </div>
            <div className="stat-card">
              <p className="stamp-label text-outline">Remaining</p>
              <p className="font-serif text-headline-lg text-on-surface-variant mt-2">
                {progress.remainingDays}
              </p>
              <p className="stamp-label text-on-surface-variant mt-1">days left</p>
            </div>
          </div>
        )}

        {/* Contribution grid */}
        <div className="journal-paper p-8 space-y-6">
          <div className="flex items-center justify-between">
            <p className="stamp-label text-primary">Challenge Map</p>
            <p className="stamp-label text-outline">
              {challenge.duration} total days
            </p>
          </div>
          <JourneyGrid days={days} currentDay={currentDay} challenge={challenge} />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="stat-card">
            <p className="stamp-label text-outline">Started</p>
            <p className="font-serif text-body-lg text-on-surface mt-2">
              {formatDate(challenge.startDate)}
            </p>
          </div>
          <div className="stat-card">
            <p className="stamp-label text-outline">Ends</p>
            <p className="font-serif text-body-lg text-on-surface mt-2">{endDate}</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="flex items-center gap-6 pt-4 border-t border-outline-variant/20">
          <Link to="/journal" className="nav-link text-xs">← Today's Entry</Link>
          <Link to="/archive" className="nav-link text-xs">Archive →</Link>
        </div>
      </div>
    </div>
  );
}
