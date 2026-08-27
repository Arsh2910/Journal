import { useState, useEffect, useCallback } from "react";
import { getAllJournals } from "../services/journalApi";

export function useJournal() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllJournals();
      setJournals(data.journals || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  // Returns the journal for a given dayNumber
  const getByDay = useCallback(
    (dayNumber) => journals.find((j) => j.dayNumber === dayNumber) || null,
    [journals],
  );

  // Set of documented dayNumbers (from actual journal data, not currentDay)
  const documentedDays = new Set(journals.map((j) => j.dayNumber));

  return { journals, loading, error, refetch: fetch, getByDay, documentedDays };
}
