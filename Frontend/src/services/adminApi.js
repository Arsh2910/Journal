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

export const getStats = () =>
  fetch(`${API}/api/admin/stats`, opts("GET")).then(handle);

export const getUsers = (page = 1, limit = 20) =>
  fetch(`${API}/api/admin/users?page=${page}&limit=${limit}`, opts("GET")).then(handle);

export const deleteUser = (id) =>
  fetch(`${API}/api/admin/users/${id}`, opts("DELETE")).then(handle);
