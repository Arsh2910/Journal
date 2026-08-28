import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useChallenge } from "../hooks/useChallenge";
import { getProgress, getDayMap } from "../services/progressApi";
import JourneyGrid from "../components/JourneyGrid";
import LoadingState from "../components/LoadingState";

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
        <LoadingState message="Reviewing your journey..." />
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

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-page-margin max-w-[1200px] mx-auto desk-texture">
      <div className="w-full max-w-4xl flex flex-col items-center" style={{ animation: "fade-in 0.4s ease-out" }}>
        
        {/* Header Text */}
        <div className="text-center mb-12 space-y-4">
          <p className="stamp-label text-primary">Your Journey</p>
          <h2 className="font-serif text-display-lg text-secondary-fixed">The {challenge.duration} Days</h2>
          
          {progress && (
            <div className="flex flex-wrap items-center justify-center gap-6 font-sans text-label-md">
              <span className="text-primary flex items-center gap-2">
                <span className="w-3 h-3 bg-primary-container opacity-90 inline-block border border-outline-variant/30"></span>
                {progress.completedDays} of {challenge.duration} days documented
              </span>
              <span className="text-on-surface-variant flex items-center gap-2">
                <span className="w-3 h-3 border border-outline inline-block"></span>
                {progress.missedDays} missed
              </span>
              <span className="text-on-surface-variant/50 flex items-center gap-2">
                <span className="w-3 h-3 border border-outline/50 opacity-60 inline-block"></span>
                {progress.remainingDays} remaining
              </span>
            </div>
          )}
        </div>

        {/* The Grid Canvas */}
        <div className="journal-paper-active w-full p-8 md:p-12 relative overflow-hidden">
          {/* Ruled lines overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "linear-gradient(transparent calc(1.6rem - 1px), var(--color-outline-variant) 1px)",
            backgroundSize: "100% 1.6rem",
            opacity: 0.1
          }} />
          
          <div className="relative z-10 w-full">
            <JourneyGrid days={days} currentDay={currentDay} challenge={challenge} />
          </div>
        </div>

        {/* Contextual Action */}
        <div className="mt-12 flex flex-col items-center gap-8">
          <Link to="/journal" className="border border-secondary text-secondary hover:bg-secondary hover:text-on-secondary px-8 py-3 transition-colors duration-300 font-sans text-label-md tracking-widest uppercase flex items-center gap-2">
            <span className="text-lg leading-none">✒</span>
            Log Today's Entry
          </Link>

          {/* Quick links */}
          <div className="flex items-center gap-6 pt-4">
            <Link to="/archive" className="nav-link text-xs">Archive →</Link>
          </div>
        </div>
        
      </div>
    </div>
  );
}
