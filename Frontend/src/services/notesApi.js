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

// POST /api/notes/create
export const createNote = (title, date) =>
  fetch(`${API}/api/notes/create`, opts("POST", { title, date })).then(handle);

// GET /api/notes/today
export const getTodayNotes = () =>
  fetch(`${API}/api/notes/today`, opts("GET")).then(handle);

// PATCH /api/notes/:id  (note: PATCH, not PUT)
export const updateNote = (id, { title, completed }) =>
  fetch(`${API}/api/notes/${id}`, opts("PATCH", { title, completed })).then(handle);

// DELETE /api/notes/:id  (today only)
export const deleteNote = (id) =>
  fetch(`${API}/api/notes/${id}`, opts("DELETE")).then(handle);
