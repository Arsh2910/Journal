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

// POST /api/journal/create
export const createJournal = (title, content, date, mood) =>
  fetch(`${API}/api/journal/create`, opts("POST", { title, content, date, mood })).then(handle);

// GET /api/journal/all — sorted by dayNumber asc
export const getAllJournals = () =>
  fetch(`${API}/api/journal/all`, opts("GET")).then(handle);

// GET /api/journal/:id
export const getJournalById = (id) =>
  fetch(`${API}/api/journal/${id}`, opts("GET")).then(handle);

// PUT /api/journal/:id
export const updateJournal = (id, { title, content, mood }) =>
  fetch(`${API}/api/journal/${id}`, opts("PUT", { title, content, mood })).then(handle);

// DELETE /api/journal/:id  (today only)
export const deleteJournal = (id) =>
  fetch(`${API}/api/journal/${id}`, opts("DELETE")).then(handle);
