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
  getCurrentUser,
} from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser();
        setUser({
          authenticated: true,
          userName: data.userName,
          email: data.email,
          avatar: data.avatar || "avatar-default",
          role: data.role || "user",
        });
      } catch (err) {
        setUser(null);
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
      role: data.role || "user",
    });
    return data;
  }, []);

  const loginWithGoogle = useCallback((userData) => {
    setUser({
      authenticated: true,
      userName: userData.userName,
      email: userData.email,
      avatar: userData.avatar || "avatar-default",
      role: userData.role || "user",
    });
  }, []);

  const register = useCallback(async (userName, email, password, avatar) => {
    const data = await registerApi(userName, email, password, avatar);
    setUser({
      authenticated: true,
      userName: data.userName,
      email: data.email,
      avatar: data.avatar || "avatar-default",
      role: data.role || "user",
    });
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
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateUserAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
