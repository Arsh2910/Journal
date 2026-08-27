import { useState } from "react";
import { Link } from "react-router-dom";
import { useJournal } from "../hooks/useJournal";
import { useChallenge } from "../hooks/useChallenge";

const MOODS_GLYPH = {
  great: "✦", good: "◆", okay: "◇", hard: "◈", rough: "◉",
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
  const [search, setSearch] = useState("");

  const filtered = journals.filter((j) =>
    !search.trim() ||
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.content?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="turning-page">Leafing through the pages...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background desk-texture py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-10" style={{ animation: "fade-in 0.4s ease-out" }}>
        {/* Header */}
        <div className="space-y-3">
          <p className="stamp-label text-primary">Journal Archive</p>
          <h1 className="font-serif text-display-lg text-secondary-fixed" style={{ letterSpacing: "-0.02em" }}>
            Your Pages
          </h1>
          <div className="w-16 h-px bg-outline-variant/50" />
          <p className="font-serif italic text-on-surface-variant text-body-md">
            {journals.length} {journals.length === 1 ? "entry" : "entries"} written
            {challenge ? ` across ${challenge.duration} days` : ""}.
          </p>
        </div>

        {/* Search */}
        <div className="space-y-1">
          <input
            type="text"
            className="ink-input text-body-md"
            placeholder="Search your pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Entries */}
        <div className="journal-paper divide-y divide-outline-variant/20">
          {filtered.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-serif italic text-on-surface-variant text-body-md opacity-60">
                {search ? "No entries match your search." : "No pages written yet."}
              </p>
            </div>
          ) : (
            filtered.map((j) => {
              const isToday = j.dayNumber === currentDay;
              return (
                <Link
                  key={j._id}
                  to={isToday ? "/journal" : `/journal/${j.dayNumber}`}
                  className="archive-entry group"
                >
                  {/* Day number */}
                  <div className="flex-shrink-0 w-20 text-right">
                    <span className="font-sans text-label-sm uppercase tracking-widest text-outline">
                      Day
                    </span>
                    <p className="font-serif text-headline-md text-secondary-fixed/70 leading-none">
                      {j.dayNumber}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-full bg-outline-variant/30 self-stretch mx-2 flex-shrink-0" />

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-serif text-body-lg text-on-surface group-hover:text-secondary transition-colors truncate">
                      {j.title || <em className="opacity-50 text-body-md">Untitled</em>}
                    </h3>
                    {j.content && (
                      <p className="font-serif text-body-md text-on-surface-variant truncate opacity-70">
                        {j.content.slice(0, 100)}...
                      </p>
                    )}
                    <p className="stamp-label text-outline">
                      {formatDate(j.date)}
                    </p>
                  </div>

                  {/* Mood glyph */}
                  {j.mood && (
                    <div className="flex-shrink-0 text-tertiary/60 text-lg">
                      {MOODS_GLYPH[j.mood] || ""}
                    </div>
                  )}
                </Link>
              );
            })
          )}
        </div>

        {/* Footer nav */}
        <div className="flex items-center gap-6 pt-4 border-t border-outline-variant/20">
          <Link to="/journal" className="nav-link text-xs">← Today's Entry</Link>
          <Link to="/journey" className="nav-link text-xs">Journey Map →</Link>
        </div>
      </div>
    </div>
  );
}
