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

// POST /api/challenge/create  — startDate must be today (backend enforces)
export const createChallenge = (startDate, duration) =>
  fetch(`${API}/api/challenge/create`, opts("POST", { startDate, duration })).then(handle);

// GET /api/challenge/current
export const getCurrentChallenge = () =>
  fetch(`${API}/api/challenge/current`, opts("GET")).then(handle);
