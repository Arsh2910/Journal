import { useState } from "react";

// GoalItem — single note/goal with ink checkbox
export default function GoalItem({ note, onToggle, onEdit, onDelete, isToday }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(note.title);
  const [confirming, setConfirming] = useState(false);

  const submitEdit = async () => {
    if (draft.trim() && draft !== note.title) {
      await onEdit(note._id, draft.trim());
    }
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirming) { setConfirming(true); return; }
    await onDelete(note._id);
  };

  return (
    <div className={`flex items-start gap-3 py-2 group transition-opacity duration-200 ${note.completed ? "opacity-60" : ""}`}>
      {/* Ink checkbox */}
      <button
        type="button"
        disabled={!isToday}
        onClick={() => isToday && onToggle(note._id, !note.completed)}
        className={`checkbox-ink mt-0.5 ${note.completed ? "checked" : ""} ${!isToday ? "cursor-default" : ""}`}
        aria-label={note.completed ? "Mark incomplete" : "Mark complete"}
      />

      {/* Title */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            autoFocus
            className="ink-input text-body-md w-full"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={submitEdit}
            onKeyDown={(e) => e.key === "Enter" && submitEdit()}
          />
        ) : (
          <span
            className={`font-serif text-body-md text-on-surface ${note.completed ? "line-through text-on-surface-variant" : ""} ${isToday ? "cursor-pointer" : ""}`}
            onDoubleClick={() => isToday && setEditing(true)}
          >
            {note.title}
          </span>
        )}
      </div>

      {/* Actions — today only */}
      {isToday && (
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="stamp-label text-outline hover:text-secondary transition-colors"
            >
              edit
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            className={`stamp-label transition-colors ${confirming ? "text-error" : "text-outline hover:text-error"}`}
          >
            {confirming ? "confirm?" : "del"}
          </button>
          {confirming && (
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="stamp-label text-outline hover:text-secondary"
            >
              cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}
