import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  updateAvatar as updateAvatarApi,
} from "../services/authApi";
import { getCurrentChallenge } from "../services/challengeApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
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
        if (
          err.message?.includes("401") ||
          err.message?.includes("No active challenge")
        ) {
          // If no active challenge, still authenticated — check differently
          try {
            // Try fetching journals to confirm auth
            const res = await fetch(
              `${import.meta.env.VITE_API_URL}/api/journal/all`,
              {
                credentials: "include",
              },
            );
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
    setUser({
      authenticated: true,
      userName: data.userName,
      email: data.email,
      avatar: data.avatar || "avatar-default",
    });
    return data;
  }, []);

  const loginWithGoogle = useCallback((userData) => {
    setUser({
      authenticated: true,
      userName: userData.userName,
      email: userData.email,
      avatar: userData.avatar || "avatar-default",
    });
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

  /**
   * Update the logged-in user's avatar.
   * Calls the API, then optimistically updates user state in context.
   * Returns the new avatar ID on success, or throws on error.
   */
  const updateUserAvatar = useCallback(async (avatarId) => {
    const data = await updateAvatarApi(avatarId);
    setUser((prev) => ({ ...prev, avatar: data.avatar }));
    return data.avatar;
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, loginWithGoogle, register, logout, updateUserAvatar }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
