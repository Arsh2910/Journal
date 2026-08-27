import { useState, useEffect, useCallback } from "react";
import { getCurrentChallenge } from "../services/challengeApi";

export function useChallenge() {
  const [challenge, setChallenge]   = useState(null);
  const [currentDay, setCurrentDay] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentChallenge();
      setChallenge(data.challenge);
      setCurrentDay(data.currentDay);
    } catch (err) {
      setError(err.message);
      setChallenge(null);
      setCurrentDay(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { challenge, currentDay, loading, error, refetch: fetch };
}
