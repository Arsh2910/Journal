import { useState, useEffect, useCallback, useRef } from "react";

// Local-timezone-safe today (avoids UTC offset bug for IST/UTC+ users)
const getLocalToday = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};
import { useParams, useNavigate, Link } from "react-router-dom";
import { useChallenge } from "../hooks/useChallenge";
import { useJournal } from "../hooks/useJournal";
import {
  createJournal, getJournalById, updateJournal, deleteJournal,
} from "../services/journalApi";
import PageHeader from "../components/PageHeader";
import MoodSelector from "../components/MoodSelector";
import StickyNote from "../components/StickyNote";
import LockedDay from "../components/LockedDay";
import LoadingState from "../components/LoadingState";

export default function Journal() {
  const { day: dayParam }  = useParams();
  const navigate           = useNavigate();
  const { challenge, currentDay, loading: cLoading, error: cError } = useChallenge();
  const { journals, loading: jLoading, refetch, getByDay, documentedDays } = useJournal();

  // Which day are we viewing?
  const viewingDay = dayParam ? parseInt(dayParam, 10) : currentDay;
  const isToday    = viewingDay === currentDay;
  const isFuture   = viewingDay > currentDay;
  const isPast     = viewingDay < currentDay;

  // Journal state
  const [journal, setJournal]       = useState(null);
  const [title, setTitle]           = useState("");
  const [content, setContent]       = useState("");
  const [mood, setMood]             = useState("good");
  const [saved, setSaved]           = useState(true);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [direction, setDirection]   = useState("right"); // page turn direction

  const autoSaveTimer = useRef(null);

  // Load journal for viewingDay
  useEffect(() => {
    if (!currentDay) return;
    const found = getByDay(viewingDay);
    if (found) {
      setJournal(found);
      setTitle(found.title || "");
      setContent(found.content || "");
      setMood(found.mood || "good");
      setSaved(true);
    } else {
      setJournal(null);
      setTitle("");
      setContent("");
      setMood("good");
      setSaved(true);
    }
  }, [viewingDay, getByDay, currentDay]);

  // Navigate to day
  const goToDay = (day) => {
    if (day < 1 || day > (challenge?.duration || Infinity)) return;
    if (day > currentDay) return; // locked
    setDirection(day > viewingDay ? "right" : "left");
    navigate(day === currentDay ? "/journal" : `/journal/${day}`);
  };

  // Auto-save logic (only for today)
  const autoSave = useCallback(async (t, c, m) => {
    if (!isToday || !journal) return;
    setSaving(true);
    try {
      const data = await updateJournal(journal._id, { title: t, content: c, mood: m });
      setJournal(data.journal);
      setSaved(true);
      refetch();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [isToday, journal, refetch]);

  const handleChange = (field, value) => {
    if (field === "title")   setTitle(value);
    if (field === "content") setContent(value);
    if (field === "mood")    setMood(value);
    setSaved(false);
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      const t = field === "title"   ? value : title;
      const c = field === "content" ? value : content;
      const m = field === "mood"    ? value : mood;
      autoSave(t, c, m);
    }, 1500);
  };

  // Create journal
  const handleCreate = async () => {
    setError("");
    setSaving(true);
    try {
      const today = getLocalToday();
      const data  = await createJournal(title, content, today, mood);
      setJournal(data.journal);
      setSaved(true);
      refetch();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete journal
  const handleDelete = async () => {
    if (!deleteConfirm) { setDeleteConfirm(true); return; }
    try {
      await deleteJournal(journal._id);
      setJournal(null);
      setTitle("");
      setContent("");
      setMood("good");
      setDeleteConfirm(false);
      refetch();
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Loading / error states ---
  if (cLoading || jLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingState message="Turning the page..." />
      </div>
    );
  }

  if (cError && cError.includes("No active challenge")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background desk-texture gap-6 px-4 text-center">
        <p className="font-serif text-headline-md text-secondary">No active challenge.</p>
        <p className="font-serif italic text-on-surface-variant text-body-md">
          Start a challenge to begin writing your story.
        </p>
        <Link to="/create" className="btn-embossed">Begin a Challenge</Link>
      </div>
    );
  }

  if (!challenge) return null;

  return (
    <div className="min-h-screen bg-background desk-texture">
      <div className="max-w-6xl mx-auto px-page-margin py-12 space-y-8">
        {/* Day navigation bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => goToDay(viewingDay - 1)}
            disabled={viewingDay <= 1}
            className="btn-ghost py-1.5 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          {/* Day dots strip (mini progress) */}
          <div className="flex items-center gap-0.5 flex-wrap justify-center max-w-xs">
            {Array.from({ length: Math.min(challenge.duration, 20) }, (_, i) => {
              const d = i + 1;
              const isDoc  = documentedDays.has(d);
              const isCur  = d === currentDay;
              const isView = d === viewingDay;
              const isFut  = d > currentDay;
              return (
                <div
                  key={d}
                  onClick={() => !isFut && goToDay(d)}
                  title={`Day ${d}`}
                  className={`w-2 h-2 transition-all duration-200 ${
                    isFut ? "cursor-not-allowed opacity-20 bg-surface-container-low" :
                    isDoc ? "cursor-pointer bg-primary-container" :
                    isCur ? "cursor-pointer bg-primary" :
                    "cursor-pointer bg-surface-container"
                  } ${isView ? "ring-1 ring-secondary scale-125" : ""}`}
                />
              );
            })}
            {challenge.duration > 20 && (
              <span className="stamp-label text-outline ml-1">+{challenge.duration - 20}</span>
            )}
          </div>

          <button
            onClick={() => goToDay(viewingDay + 1)}
            disabled={viewingDay >= currentDay}
            className="btn-ghost py-1.5 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>

        {/* Main journal layout */}
        <div
          className={`flex flex-col lg:flex-row gap-8 ${direction === "right" ? "animate-page-in-right" : "animate-page-in-left"}`}
          style={{ animation: `pageIn${direction === "right" ? "Right" : "Left"} 0.35s ease-out` }}
        >
          {/* Journal paper */}
          <div className={`flex-1 ${isToday ? "journal-paper-active" : "journal-paper"} shadow-paper-lift`}>
            {isFuture ? (
              <LockedDay dayNumber={viewingDay} />
            ) : (
              <div className="p-10 space-y-8">
                {/* Page number top-right */}
                <div className="flex justify-between items-start">
                  <PageHeader
                    dayNumber={viewingDay}
                    date={
                      journal?.date ||
                      (isToday ? getLocalToday() : null)
                    }
                    total={challenge.duration}
                  />
                  <div className="text-right space-y-1">
                    <p className="page-number">{viewingDay}</p>
                    {isToday && !saved && (
                      <p className="stamp-label text-tertiary/60">
                        {saving ? "Saving..." : "Unsaved"}
                      </p>
                    )}
                    {isToday && saved && journal && (
                      <p className="stamp-label text-primary/60">Saved ✓</p>
                    )}
                  </div>
                </div>

                {/* Ruled writing area */}
                {isToday ? (
                  <div className="space-y-6">
                    {/* Title */}
                    <div className="ruled-lines-page py-1">
                      <input
                        className="ink-textarea text-headline-md font-serif w-full bg-transparent outline-none border-none text-secondary placeholder-on-surface-variant/30"
                        placeholder="Give this day a title..."
                        value={title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        style={{ lineHeight: "1.6rem" }}
                      />
                    </div>

                    {/* Content */}
                    <div className="ruled-lines-page">
                      <textarea
                        className="ink-textarea w-full h-72 bg-transparent text-body-md"
                        placeholder="Write about your day..."
                        value={content}
                        onChange={(e) => handleChange("content", e.target.value)}
                      />
                    </div>

                    {/* Mood */}
                    <MoodSelector value={mood} onChange={(m) => handleChange("mood", m)} />

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-4 border-t border-outline-variant/20">
                      {!journal ? (
                        <button
                          type="button"
                          onClick={handleCreate}
                          disabled={saving || (!title && !content)}
                          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {saving ? "Inscribing..." : "Inscribe This Day"}
                        </button>
                      ) : (
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => autoSave(title, content, mood)}
                            disabled={saved || saving}
                            className="btn-primary disabled:opacity-40"
                          >
                            {saving ? "Saving..." : "Save Changes"}
                          </button>
                          <button
                            type="button"
                            onClick={handleDelete}
                            className="btn-danger"
                          >
                            {deleteConfirm ? "Confirm delete?" : "Delete Entry"}
                          </button>
                          {deleteConfirm && (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirm(false)}
                              className="stamp-label text-outline hover:text-secondary"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {error && (
                      <p className="font-sans text-label-sm text-error border-l-2 border-error pl-3">
                        {error}
                      </p>
                    )}
                  </div>
                ) : (
                  /* Read-only past page */
                  <div className="space-y-6">
                    {journal ? (
                      <>
                        <div className="ruled-lines-page py-1">
                          <h2 className="font-serif text-headline-md text-secondary-fixed">
                            {journal.title || <em className="opacity-40">Untitled</em>}
                          </h2>
                        </div>
                        <div className="ruled-lines-page min-h-48">
                          <p className="font-serif text-body-md text-on-surface whitespace-pre-wrap leading-[1.6rem]">
                            {journal.content || <em className="opacity-40">No content written.</em>}
                          </p>
                        </div>
                        {journal.mood && (
                          <MoodSelector value={journal.mood} readOnly />
                        )}
                        <p className="stamp-label text-outline italic">
                          This page is sealed. Past entries are read-only.
                        </p>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center min-h-48 space-y-4 opacity-40">
                        <div className="w-px h-16 bg-outline-variant/30" />
                        <p className="font-serif italic text-on-surface-variant text-body-md">
                          This day was not documented.
                        </p>
                        <div className="w-px h-16 bg-outline-variant/30" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sticky note — today only */}
          {isToday && !isFuture && (
            <div className="lg:w-72 flex-shrink-0 flex justify-center lg:justify-start pt-16">
              <StickyNote isToday={isToday} />
            </div>
          )}
        </div>

        {/* Quick nav footer */}
        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
          <Link to="/journey" className="nav-link text-xs">
            View Full Journey →
          </Link>
          <Link to="/archive" className="nav-link text-xs">
            Archive →
          </Link>
        </div>
      </div>
    </div>
  );
}
