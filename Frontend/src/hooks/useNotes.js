import { useState, useEffect, useCallback } from "react";
import { getTodayNotes, createNote, updateNote, deleteNote } from "../services/notesApi";

export function useNotes() {
  const [notes, setNotes]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTodayNotes();
      setNotes(data.notes || []);
    } catch (err) {
      setError(err.message);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const addNote = useCallback(async (title) => {
    const now   = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const data  = await createNote(title, today);
    setNotes((prev) => [...prev, data.note]);
    return data.note;
  }, []);

  const toggleNote = useCallback(async (id, completed) => {
    const data = await updateNote(id, { completed });
    setNotes((prev) => prev.map((n) => (n._id === id ? data.note : n)));
  }, []);

  const editNote = useCallback(async (id, title) => {
    const data = await updateNote(id, { title });
    setNotes((prev) => prev.map((n) => (n._id === id ? data.note : n)));
  }, []);

  const removeNote = useCallback(async (id) => {
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
  }, []);

  const completedCount = notes.filter((n) => n.completed).length;

  return {
    notes, loading, error, completedCount,
    refetch: fetchNotes,
    addNote, toggleNote, editNote, removeNote,
  };
}
