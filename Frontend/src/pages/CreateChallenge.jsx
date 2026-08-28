import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createChallenge } from "../services/challengeApi";

const DURATIONS = [30, 50, 75, 100];

// Get today's date in local timezone (YYYY-MM-DD)
function getLocalToday() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function CreateChallenge() {
  const navigate = useNavigate();
  const today = getLocalToday();

  const [duration, setDuration]   = useState(100);
  const [custom, setCustom]       = useState("");
  const [isCustom, setIsCustom]   = useState(false);
  const [intention, setIntention] = useState("");
  const [notes, setNotes]         = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  const effectiveDuration = isCustom ? parseInt(custom, 10) || 0 : duration;

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
    <div className="min-h-screen bg-background text-on-surface font-body-md flex flex-col md:flex-row desk-texture">
      <main className="flex-grow flex flex-col items-center justify-center py-page-margin px-4 md:px-page-margin relative z-10 w-full max-w-[1200px] mx-auto">
        
        <div className="flex flex-col md:flex-row w-full max-w-5xl items-start">
          
          {/* The Paper Canvas (Left/Main Side) */}
          <section className="flex-1 journal-paper-active w-full p-8 md:p-12 relative overflow-hidden shadow-2xl">
            {/* Ruled Lines Overlay */}
            <div className="absolute inset-0 pt-[6.5rem] pointer-events-none" style={{
              backgroundImage: "linear-gradient(transparent calc(1.6rem - 1px), var(--color-outline-variant) 1px)",
              backgroundSize: "100% 1.6rem",
              opacity: 0.15
            }} />
            
            {/* Header / Controls */}
            <header className="flex justify-between items-start mb-16 relative z-20">
              <button onClick={() => navigate(-1)} aria-label="Cancel and return" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
                <span className="text-2xl opacity-60 hover:opacity-100">✕</span>
              </button>
              <div className="text-right">
                <h1 className="font-serif text-headline-lg md:text-display-lg text-secondary-fixed">New Undertaking</h1>
                <p className="font-sans text-label-md text-on-surface-variant mt-2 uppercase tracking-widest opacity-80">Establish Parameters</p>
              </div>
            </header>
            
            {/* Form Content */}
            <form className="space-y-12 relative z-20" onSubmit={handleSubmit}>
              
              {/* Input: Intention */}
              <div className="relative group">
                <label className="font-sans text-label-md text-on-surface-variant block mb-2 uppercase tracking-[0.1em]" htmlFor="intention">The Intention</label>
                <input
                  autoComplete="off"
                  className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 font-serif text-body-lg text-on-surface placeholder-on-surface-variant/40 py-2 outline-none transition-colors duration-300"
                  id="intention"
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  placeholder="State your objective (e.g., Read 50 pages daily)"
                />
              </div>
              
              {/* Input: Start Date */}
              <div className="relative group w-full md:w-1/2">
                <label className="font-sans text-label-md text-on-surface-variant block mb-2 uppercase tracking-[0.1em]" htmlFor="start_date">Commencement Date</label>
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 font-serif text-body-lg text-on-surface py-2 outline-none transition-colors duration-300 [color-scheme:dark]"
                  id="start_date"
                  type="date"
                  value={today}
                  readOnly
                  disabled
                />
                <p className="font-sans text-label-sm text-outline mt-2 italic">(Challenges must commence today)</p>
              </div>
              
              {/* Additional Context (Optional) */}
              <div className="relative group mt-8">
                <label className="font-sans text-label-md text-on-surface-variant block mb-2 uppercase tracking-[0.1em]" htmlFor="notes">Initial Thoughts <span className="opacity-50 lowercase">(optional)</span></label>
                <textarea
                  className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 font-serif text-body-md text-on-surface placeholder-on-surface-variant/40 py-2 outline-none transition-colors duration-300 resize-none"
                  id="notes"
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Why is this important now?"
                />
              </div>
              
              {error && (
                <p className="font-sans text-label-sm text-error border-l-2 border-error pl-3">
                  {error}
                </p>
              )}
              
              {/* Action Button (Ink Stamp Style) */}
              <div className="mt-16 pt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || effectiveDuration < 1}
                  className="group relative px-8 py-4 border border-secondary text-secondary font-serif text-headline-md uppercase tracking-widest overflow-hidden transition-all duration-300 ease-in-out hover:border-primary hover:shadow-[0_0_15px_rgba(171,209,161,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-on-primary-container">
                    {loading ? "Sealing..." : "Seal The Pact"}
                  </span>
                  {/* Stamp Fill Effect */}
                  {!loading && effectiveDuration > 0 && (
                    <div className="absolute inset-0 bg-primary transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 opacity-95" />
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Bookmarks / Duration Tabs (Right Side) */}
          <aside className="md:w-auto w-full flex md:flex-col flex-row md:-ml-[1px] md:pt-32 z-0 relative overflow-x-auto md:overflow-visible mt-4 md:mt-0 no-scrollbar">
            <div className="flex md:flex-col flex-row gap-2 md:gap-4 px-2 md:px-0 min-w-max">
              <span className="hidden md:block font-sans text-label-sm text-on-surface-variant uppercase tracking-widest mb-2 pl-6 transform rotate-90 origin-left whitespace-nowrap opacity-60">
                Duration
              </span>
              
              {DURATIONS.map((d) => {
                const isActive = !isCustom && duration === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => { setDuration(d); setIsCustom(false); }}
                    className={`md:rounded-l-none md:rounded-r-md rounded-md border md:border-l-0 px-6 py-4 shadow-[2px_2px_5px_rgba(0,0,0,0.3)] transition-all duration-200 transform md:hover:translate-x-1 focus:outline-none flex flex-col items-center justify-center min-w-[80px]
                      ${isActive 
                        ? 'bg-[#151311] border-outline-variant text-primary ring-1 ring-primary/50' 
                        : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-bright hover:text-on-surface'
                      }`}
                  >
                    <span className="font-serif text-headline-md">{d}</span>
                    <span className={`font-sans text-label-sm ${isActive ? 'opacity-80' : 'opacity-60'}`}>Days</span>
                  </button>
                );
              })}

              {/* Custom Duration Tab */}
              <div
                className={`md:rounded-l-none md:rounded-r-md rounded-md border md:border-l-0 shadow-[2px_2px_5px_rgba(0,0,0,0.3)] transition-all duration-200 focus:outline-none flex flex-col items-center justify-center min-w-[80px] overflow-hidden
                  ${isCustom 
                    ? 'bg-[#151311] border-outline-variant text-primary ring-1 ring-primary/50 p-2' 
                    : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-bright hover:text-on-surface px-6 py-4 transform md:hover:translate-x-1 cursor-pointer'
                  }`}
                onClick={() => !isCustom && setIsCustom(true)}
              >
                {!isCustom ? (
                  <>
                    <span className="font-serif text-headline-md leading-none mb-1">✎</span>
                    <span className="font-sans text-label-sm opacity-60 mt-1">Custom</span>
                  </>
                ) : (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                    <input
                      type="number"
                      min="1"
                      max="365"
                      autoFocus
                      className="bg-transparent border-0 border-b border-primary text-center font-serif text-headline-md w-16 p-0 focus:ring-0 focus:border-primary text-primary"
                      value={custom}
                      onChange={(e) => setCustom(e.target.value)}
                      placeholder="?"
                    />
                    <span className="font-sans text-label-sm opacity-80 mt-1">Days</span>
                  </div>
                )}
              </div>
            </div>
          </aside>
          
        </div>
      </main>
    </div>
  );
}
