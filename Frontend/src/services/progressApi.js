const API = import.meta.env.VITE_API_URL;

const opts = (method) => ({
  method,
  credentials: "include",
  headers: { "Content-Type": "application/json" },
});

const handle = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
};

// GET /api/progress — completedDays, missedDays, progress%, completedDayNumbers
export const getProgress = () =>
  fetch(`${API}/api/progress`, opts("GET")).then(handle);

// GET /api/progress/days — [{day, completed}] full map
export const getDayMap = () =>
  fetch(`${API}/api/progress/days`, opts("GET")).then(handle);
