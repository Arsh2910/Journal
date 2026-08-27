import { useState } from "react";
import GoalItem from "./GoalItem";
import { useNotes } from "../hooks/useNotes";

export default function StickyNote({ isToday = false }) {
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
    <div className="sticky-note p-6 w-full max-w-xs" style={{ animation: "settle 0.4s ease-out forwards" }}>
      {/* Header */}
      <div className="mb-4 pb-3 border-b border-tertiary/20">
        <p className="font-sans text-label-sm uppercase tracking-widest text-tertiary">
          Today's Goals
        </p>
        {notes.length > 0 && (
          <p className="font-sans text-label-sm text-on-surface-variant mt-1">
            {completedCount} / {notes.length} completed
          </p>
        )}
      </div>

      {/* Goal list */}
      {loading ? (
        <p className="turning-page text-sm">Turning the page...</p>
      ) : (
        <div className="space-y-1">
          {notes.map((note) => (
            <GoalItem
              key={note._id}
              note={note}
              isToday={isToday}
              onToggle={toggleNote}
              onEdit={editNote}
              onDelete={removeNote}
            />
          ))}
          {notes.length === 0 && !adding && (
            <p className="font-serif italic text-on-surface-variant text-sm opacity-60">
              No goals yet...
            </p>
          )}
        </div>
      )}

      {/* Add goal */}
      {isToday && (
        <div className="mt-4 pt-3 border-t border-tertiary/10">
          {adding ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                className="ink-input text-sm flex-1"
                placeholder="Add a goal..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                  if (e.key === "Escape") { setAdding(false); setNewGoal(""); }
                }}
              />
              <button
                type="button"
                onClick={handleAdd}
                className="stamp-label text-primary hover:text-primary-fixed transition-colors"
              >
                add
              </button>
              <button
                type="button"
                onClick={() => { setAdding(false); setNewGoal(""); }}
                className="stamp-label text-outline hover:text-secondary transition-colors"
              >
                esc
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="stamp-label text-outline hover:text-tertiary transition-colors flex items-center gap-1.5"
            >
              <span className="text-lg leading-none">+</span>
              Add goal
            </button>
          )}
        </div>
      )}
    </div>
  );
}
