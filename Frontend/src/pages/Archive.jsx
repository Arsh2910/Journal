import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useJournal } from "../hooks/useJournal";
import { useChallenge } from "../hooks/useChallenge";
import { useTheme } from "../context/ThemeContext";

const MOODS_GLYPH = {
  great: "✦",
  good: "◆",
  okay: "◇",
  hard: "◈",
  rough: "◉",
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function Archive() {
  const { journals, loading } = useJournal();
  const { challenge, currentDay } = useChallenge();
  const { theme } = useTheme();
  const [search, setSearch] = useState("");

  const filtered = journals.filter(
    (j) =>
      !search.trim() ||
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.content?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="turning-page">Leafing through the pages...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md flex flex-col md:flex-row desk-texture">
      {/* Desktop SideNav */}
      <nav className="hidden md:flex flex-col h-full w-64 fixed left-0 border-r border-outline-variant bg-surface-container shadow-[2px_0_10px_rgba(0,0,0,0.5)] py-stack-unit px-4 z-20">
        <div className="mb-8 mt-4">
          <Link
            to="/profile"
            className="font-serif text-headline-md text-secondary-fixed hover:text-primary transition-colors"
          >
            The Daybook
          </Link>
          <p className="font-sans text-label-sm text-on-surface-variant mt-1">
            Anno Domini {new Date().getFullYear()}
          </p>
        </div>

        <Link
          to="/journal"
          className="w-full mb-8 border border-secondary text-secondary hover:bg-primary hover:text-on-primary hover:border-primary transition-colors duration-200 py-2 px-4 flex items-center justify-center gap-2 font-sans text-label-md shadow-sm"
        >
          <span className="text-xl leading-none -mt-1">+</span>
          New Entry
        </Link>

        <ul className="flex-grow flex flex-col gap-2">
          <li>
            <NavLink
              to="/archive"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-300 ease-in-out ${isActive ? "text-primary font-bold border-r-2 border-primary bg-primary-container/10" : "text-on-surface-variant hover:bg-secondary-container/20 hover:text-secondary-fixed-dim"}`
              }
            >
              <span className="font-serif text-lg leading-none">☰</span>
              <span className="font-sans text-label-md">Table of Contents</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/journey"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-300 ease-in-out ${isActive ? "text-primary font-bold border-r-2 border-primary bg-primary-container/10" : "text-on-surface-variant hover:bg-secondary-container/20 hover:text-secondary-fixed-dim"}`
              }
            >
              <span className="font-serif text-lg leading-none">🗺</span>
              <span className="font-sans text-label-md">Journey Map</span>
            </NavLink>
          </li>
          <li>
            <button className="flex w-full items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-secondary-container/20 hover:text-secondary-fixed-dim transition-all duration-300 ease-in-out rounded-sm opacity-50 cursor-not-allowed">
              <span className="font-serif text-lg leading-none">🔖</span>
              <span className="font-sans text-label-md">Bookmarks</span>
            </button>
          </li>
        </ul>

        <div className="mt-auto pt-4 border-t border-outline-variant/30">
          <ul className="flex flex-col gap-2">
            <li>
              <button className="flex w-full items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-secondary-container/20 hover:text-secondary-fixed-dim transition-all duration-300 ease-in-out rounded-sm opacity-50 cursor-not-allowed">
                <span className="font-serif text-lg leading-none">⇲</span>
                <span className="font-sans text-label-md">Export</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow md:ml-64 flex flex-col items-center py-page-margin px-4 md:px-page-margin relative z-10 w-full">
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden flex flex-col gap-2 w-full mb-8 pb-4 border-b border-outline-variant/30">
          <h1 className="font-serif text-headline-lg font-bold text-secondary-fixed tracking-tight">
            Daybook
          </h1>
          <div className="flex items-center gap-4 text-on-surface-variant">
            <Link
              to="/journal"
              className="font-sans text-label-md hover:text-primary"
            >
              New Entry
            </Link>
            <Link
              to="/journey"
              className="font-sans text-label-md hover:text-primary"
            >
              Journey Map
            </Link>
          </div>
        </header>

        {/* Search */}
        <div className="w-full max-w-[800px] mb-6">
          <input
            type="text"
            className="ink-input w-full md:w-64"
            placeholder="Search your pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* The Journal Spread */}
        <div className="w-full max-w-[800px] journal-paper-active shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4),0_2px_4px_-1px_rgba(0,0,0,0.24)] p-8 md:p-12 relative min-h-[716px]">
          {/* Subtle ruled lines representation */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(transparent, transparent 1.5rem, rgba(67, 72, 64, 0.1) 1.5rem, rgba(67, 72, 64, 0.1) 1.6rem)",
            }}
          ></div>

          <div
            className="relative z-10"
            style={{ animation: "fade-in 0.4s ease-out" }}
          >
            <header className="text-center mb-12 space-y-2">
              <p className="stamp-label text-primary">Journal Archive</p>
              <h2 className="font-serif text-headline-lg md:text-display-lg text-secondary-fixed mb-2">
                Table of Contents
              </h2>
              <p className="font-sans text-label-md text-on-surface-variant italic">
                {journals.length} {journals.length === 1 ? "entry" : "entries"}{" "}
                written
                {challenge ? ` across ${challenge.duration} days` : ""}.
              </p>
            </header>

            <div className="space-y-0 border-y border-outline-variant/50">
              {filtered.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="font-serif italic text-on-surface-variant text-body-md opacity-60">
                    {search
                      ? "No entries match your search."
                      : "No pages written yet."}
                  </p>
                </div>
              ) : (
                filtered.map((j) => {
                  const isToday = j.dayNumber === currentDay;
                  return (
                    <Link
                      key={j._id}
                      to={isToday ? "/journal" : `/journal/${j.dayNumber}`}
                      className={`group flex items-baseline justify-between py-4 border-b border-outline-variant/30 hover:bg-outline-variant/10 transition-colors ${isToday ? "bg-primary-container/5" : ""}`}
                    >
                      <div className="flex items-baseline gap-4 w-3/4">
                        <span
                          className={`font-sans text-label-md w-12 text-right ${isToday ? "text-primary font-bold" : "text-outline"}`}
                        >
                          {String(j.dayNumber).padStart(2, "0")}
                        </span>

                        <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4 flex-1 min-w-0">
                          <span
                            className={`font-serif text-body-lg group-hover:text-primary transition-colors truncate ${isToday ? "text-primary" : "text-secondary-fixed"}`}
                          >
                            {j.title || (
                              <em className="opacity-50">Untitled</em>
                            )}
                          </span>

                          {j.content && (
                            <span className="font-serif text-body-md text-on-surface-variant truncate opacity-60 md:max-w-[40%]">
                              {j.content.slice(0, 60)}...
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-baseline gap-4 text-right shrink-0">
                        <span className="hidden md:inline font-sans text-label-sm uppercase tracking-widest text-outline">
                          {formatDate(j.date)}
                        </span>
                        {j.mood && (
                          <span
                            className="text-tertiary/60 text-lg w-6 text-center"
                            title={j.mood}
                          >
                            {MOODS_GLYPH[j.mood]}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
