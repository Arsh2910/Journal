const API = import.meta.env.VITE_API_URL;

const opts = (method, body) => ({
  method,
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  ...(body ? { body: JSON.stringify(body) } : {}),
});

const handle = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
};

export const register = (userName, email, password, avatar) =>
  fetch(`${API}/api/auth/register`, opts("POST", { userName, email, password, avatar })).then(handle);

export const login = (userName, email, password) =>
  fetch(`${API}/api/auth/login`, opts("POST", { userName, email, password })).then(handle);

export const logout = () =>
  fetch(`${API}/api/auth/logout`, opts("POST")).then(handle);

export const googleLogin = (idToken, avatar) =>
  fetch(`${API}/api/auth/google`, opts("POST", { idToken, avatar })).then(handle);

export const updateAvatar = (avatarId) =>
  fetch(`${API}/api/user/avatar`, opts("PATCH", { avatarId })).then(handle);
