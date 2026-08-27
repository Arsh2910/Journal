import GoalItem from "../components/GoalItem";
import { useNotes } from "../hooks/useNotes";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Goals() {
  const { notes, loading, completedCount, addNote, toggleNote, editNote, removeNote } = useNotes();
  const [newGoal, setNewGoal] = useState("");
  const [adding, setAdding]   = useState(false);

  const handleAdd = async () => {
    if (!newGoal.trim()) return;
    try {
      await addNote(newGoal.trim());
      setNewGoal("");
      setAdding(false);
    } catch (err) {
      console.error("Failed to add note:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background desk-texture py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-10" style={{ animation: "fade-in 0.4s ease-out" }}>
        {/* Header */}
        <div className="space-y-3">
          <p className="stamp-label text-primary">Today's Goals</p>
          <h1 className="font-serif text-display-lg text-secondary-fixed" style={{ letterSpacing: "-0.02em" }}>
            What Gets<br />
            <span className="italic">Done Today</span>
          </h1>
          <div className="w-16 h-px bg-outline-variant/50" />
        </div>

        {/* Expanded sticky note */}
        <div className="journal-paper-active p-8 space-y-6">
          {/* Sticky note header */}
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
            <div>
              <p className="stamp-label text-tertiary">Today's Goals</p>
              {notes.length > 0 && (
                <p className="font-sans text-label-sm text-on-surface-variant mt-1">
                  {completedCount} / {notes.length} completed
                </p>
              )}
            </div>
            {/* Tally marks */}
            <div className="flex items-end gap-0.5">
              {notes.map((n, i) => (
                <div
                  key={n._id}
                  className={`w-1 transition-all duration-300 ${n.completed ? "bg-primary h-4" : "bg-outline-variant/40 h-3"} ${(i + 1) % 5 === 0 ? "h-5 w-0.5 -rotate-12 origin-bottom" : ""}`}
                />
              ))}
            </div>
          </div>

          {/* Goals list */}
          {loading ? (
            <p className="turning-page">Turning the page...</p>
          ) : (
            <div className="space-y-2">
              {notes.map((note) => (
                <GoalItem
                  key={note._id}
                  note={note}
                  isToday={true}
                  onToggle={toggleNote}
                  onEdit={editNote}
                  onDelete={removeNote}
                />
              ))}
              {notes.length === 0 && !adding && (
                <p className="font-serif italic text-on-surface-variant text-body-md opacity-60">
                  No goals yet. Add one below.
                </p>
              )}
            </div>
          )}

          {/* Add new goal */}
          <div className="pt-4 border-t border-outline-variant/20">
            {adding ? (
              <div className="flex items-center gap-3">
                <input
                  autoFocus
                  className="ink-input flex-1 text-body-md"
                  placeholder="What do you want to accomplish today?"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")  handleAdd();
                    if (e.key === "Escape") { setAdding(false); setNewGoal(""); }
                  }}
                />
                <button type="button" onClick={handleAdd} className="btn-primary py-1.5 px-4 text-sm">
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => { setAdding(false); setNewGoal(""); }}
                  className="stamp-label text-outline hover:text-secondary"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="flex items-center gap-2 text-on-surface-variant hover:text-tertiary transition-colors"
              >
                <span className="text-xl font-serif leading-none">+</span>
                <span className="stamp-label">Add a goal</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 pt-4 border-t border-outline-variant/20">
          <Link to="/journal" className="nav-link text-xs">← Back to Journal</Link>
        </div>
      </div>
    </div>
  );
}
