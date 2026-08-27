import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { login as loginApi, register as registerApi, logout as logoutApi } from "../services/authApi";
import { getCurrentChallenge } from "../services/challengeApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, probe auth state by calling the challenge endpoint.
  // If it returns 401, we are unauthenticated. The backend has no /me route.
  useEffect(() => {
    (async () => {
      try {
        await getCurrentChallenge();
        // If it reaches here, cookie is valid
        setUser({ authenticated: true });
      } catch (err) {
        // 401 or no challenge — treat as unauthenticated or no challenge yet
        if (err.message?.includes("401") || err.message?.includes("No active challenge")) {
          // If no active challenge, still authenticated — check differently
          try {
            // Try fetching journals to confirm auth
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/journal/all`, {
              credentials: "include",
            });
            if (res.ok) {
              setUser({ authenticated: true });
            } else if (res.status === 401) {
              setUser(null);
            } else {
              setUser({ authenticated: true });
            }
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (userName, email, password) => {
    const data = await loginApi(userName, email, password);
    setUser({ authenticated: true, userName: data.userName, email: data.email });
    return data;
  }, []);

  const register = useCallback(async (userName, email, password) => {
    const data = await registerApi(userName, email, password);
    // Register doesn't set cookie — user needs to login after
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi(); // blacklists the token on the server
    } catch {
      // Token may already be expired — still clear client state
    } finally {
      setUser(null);
    }
  }, []);


  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
