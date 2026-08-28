import GoalItem from "../components/GoalItem";
import { useNotes } from "../hooks/useNotes";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingState from "../components/LoadingState";

export default function Goals() {
  const { notes, loading, completedCount, addNote, toggleNote, editNote, removeNote } = useNotes();
  const [newGoal, setNewGoal] = useState("");
  const navigate = useNavigate();

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    try {
      await addNote(newGoal.trim());
      setNewGoal("");
    } catch (err) {
      console.error("Failed to add note:", err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingState message="Gathering your intentions..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md flex flex-col overflow-x-hidden">
      {/* Charcoal Desk Background Effect */}
      <div className="absolute inset-0 z-[-1] pointer-events-none desk-texture" style={{
        backgroundImage: "radial-gradient(circle at center, var(--color-surface-container-high) 0%, var(--color-surface-container-lowest) 100%)",
        opacity: 0.5
      }}></div>

      <main className="flex-grow flex items-center justify-center p-4 md:p-page-margin relative z-0">
        
        {/* Sticky Note Container */}
        <div className="relative w-full max-w-md transform rotate-[-2deg] transition-transform duration-500 hover:rotate-[-1deg] group">
          <div className="bg-[#2b2622] shadow-[4px_8px_15px_rgba(0,0,0,0.4),-2px_4px_6px_rgba(0,0,0,0.2)] rounded p-8 sm:p-10 min-h-[400px] flex flex-col relative overflow-hidden texture-grain">
            
            {/* Ruled lines */}
            <div className="absolute inset-0 pt-24 pointer-events-none" style={{
              backgroundImage: "linear-gradient(transparent calc(1.6rem - 1px), #4a423a 1px)",
              backgroundSize: "100% 1.6rem",
              opacity: 0.4
            }}></div>

            {/* Curl Edge Effect */}
            <div className="absolute bottom-0 right-0 w-[40px] h-[40px] z-10" style={{
              background: "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)",
              borderBottomRightRadius: "4px",
              boxShadow: "-2px -2px 5px rgba(0,0,0,0.2)",
              transform: "rotate(3deg)",
              transformOrigin: "bottom right"
            }}></div>

            {/* Close / Return Button */}
            <button onClick={() => navigate("/journal")} aria-label="Return to Journal" className="absolute top-6 right-6 text-on-surface-variant hover:text-primary transition-colors z-20">
              <span className="text-2xl opacity-60 hover:opacity-100">✕</span>
            </button>

            {/* Header */}
            <header className="mb-10 text-center relative z-10">
              <h1 className="font-serif text-headline-lg text-secondary-fixed mb-1 border-b border-on-surface-variant/30 pb-3">Daily Intentions</h1>
              {notes.length > 0 && (
                <p className="font-sans text-label-sm text-on-surface-variant mt-2 uppercase tracking-widest opacity-80">
                  {completedCount} / {notes.length} Executed
                </p>
              )}
            </header>

            {/* Checklist */}
            <div className="flex-grow space-y-2 relative z-10">
              {loading ? (
                <p className="font-serif italic text-on-surface-variant text-center mt-10 opacity-60">Reading intentions...</p>
              ) : (
                <>
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
                  
                  {/* Quick Add Form inline */}
                  <form onSubmit={handleAdd} className="mt-4 pt-2 group/form flex items-center gap-3">
                    <span className="text-xl font-serif text-outline opacity-50">+</span>
                    <input
                      type="text"
                      className="w-full bg-transparent border-0 border-b border-transparent focus:border-outline-variant focus:ring-0 font-serif text-body-md text-on-surface placeholder-on-surface-variant/40 py-1 outline-none transition-colors duration-300"
                      placeholder="Add an intention..."
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                    />
                  </form>
                </>
              )}
            </div>
            
          </div>
        </div>
        
      </main>
    </div>
  );
}
