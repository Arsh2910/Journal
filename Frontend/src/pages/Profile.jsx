import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useChallenge } from "../hooks/useChallenge";
import { useJournal } from "../hooks/useJournal";
import { getProgress } from "../services/progressApi";
import { useAuth } from "../hooks/useAuth";
import ProgressBar from "../components/ProgressBar";

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

export default function Profile() {
  const { user }                     = useAuth();
  const { challenge, currentDay, loading: cLoading } = useChallenge();
  const { journals, loading: jLoading }              = useJournal();
  const [progress, setProgress]      = useState(null);

  useEffect(() => {
    if (!challenge) return;
    getProgress().then(setProgress).catch(console.error);
  }, [challenge]);

  if (cLoading || jLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="turning-page">Loading your record...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background desk-texture py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-12" style={{ animation: "fade-in 0.4s ease-out" }}>
        {/* Header */}
        <div className="space-y-3">
          <p className="stamp-label text-primary">Profile</p>
          <h1 className="font-serif text-display-lg text-secondary-fixed" style={{ letterSpacing: "-0.02em" }}>
            Your Record
          </h1>
          <div className="w-16 h-px bg-outline-variant/50" />
        </div>

        {/* Current challenge */}
        {challenge ? (
          <div className="space-y-6">
            <div className="journal-paper p-8 space-y-6">
              {/* Challenge title */}
              <div className="space-y-1">
                <p className="stamp-label text-tertiary">
                  {challenge.status === "completed" ? "Completed Challenge" : "Active Challenge"}
                </p>
                <h2 className="font-serif text-headline-lg text-secondary-fixed">
                  {challenge.duration}-Day Challenge
                </h2>
                {challenge.status === "completed" && (
                  <p className="stamp-label text-primary">✓ Completed</p>
                )}
              </div>

              {/* Current progress */}
              {progress && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="stamp-label text-outline">Current Day</p>
                      <p className="font-serif text-headline-lg text-on-surface mt-1">{currentDay}</p>
                    </div>
                    <div>
                      <p className="stamp-label text-outline">Documented</p>
                      <p className="font-serif text-headline-lg text-primary mt-1">{progress.completedDays}</p>
                    </div>
                    <div>
                      <p className="stamp-label text-outline">Missed</p>
                      <p className="font-serif text-headline-lg text-tertiary/70 mt-1">{progress.missedDays}</p>
                    </div>
                    <div>
                      <p className="stamp-label text-outline">Progress</p>
                      <p className="font-serif text-headline-lg text-secondary mt-1">{progress.progress}%</p>
                    </div>
                  </div>

                  {/* Tally progress bar */}
                  <div className="space-y-2">
                    <p className="stamp-label text-outline">Challenge Progress</p>
                    <ProgressBar
                      completed={progress.completedDays}
                      total={challenge.duration}
                      current={currentDay}
                    />
                  </div>
                </>
              )}

              {/* Dates */}
              <div className="flex gap-8 pt-4 border-t border-outline-variant/20">
                <div>
                  <p className="stamp-label text-outline">Started</p>
                  <p className="font-serif text-body-md text-on-surface mt-1">
                    {formatDate(challenge.startDate)}
                  </p>
                </div>
                <div>
                  <p className="stamp-label text-outline">Ends</p>
                  <p className="font-serif text-body-md text-on-surface mt-1">
                    {addDays(challenge.startDate, challenge.duration)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="journal-paper p-8 space-y-4">
            <p className="font-serif italic text-on-surface-variant text-body-md">
              No active challenge. Start one to begin your story.
            </p>
            <Link to="/create" className="btn-embossed inline-flex">Begin a Challenge</Link>
          </div>
        )}

        {/* Completed challenges — placeholder (no backend endpoint) */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-outline-variant/30" />
            <p className="stamp-label text-outline">Past Challenges</p>
            <div className="flex-1 h-px bg-outline-variant/30" />
          </div>
          <div className="journal-paper p-6 opacity-40">
            <p className="font-serif italic text-on-surface-variant text-body-md">
              Completed challenge history is not yet available.{" "}
              <span className="stamp-label normal-case font-normal" style={{ letterSpacing: 0 }}>
                (Endpoint pending.)
              </span>
            </p>
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center gap-6 pt-4 border-t border-outline-variant/20">
          <Link to="/journal" className="nav-link text-xs">← Today's Journal</Link>
          <Link to="/journey" className="nav-link text-xs">Journey Map →</Link>
        </div>
      </div>
    </div>
  );
}
