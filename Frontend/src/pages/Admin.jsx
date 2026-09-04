import { useState, useEffect, useCallback } from "react";
import { getStats, getUsers, deleteUser } from "../services/adminApi";
import LoadingState from "../components/LoadingState";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ---- Stat Card ---- */
function StatCard({ label, value, accent }) {
  return (
    <div className="journal-paper p-6 space-y-2">
      <p className="stamp-label text-outline">{label}</p>
      <p
        className="font-serif text-display-sm"
        style={{ color: accent || "var(--color-secondary-fixed)" }}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}

/* ---- Confirm Delete Modal ---- */
function ConfirmModal({ userName, onConfirm, onCancel, loading }) {
  return (
    <div className="admin-modal-backdrop" onClick={onCancel}>
      <div
        className="journal-paper p-8 max-w-md w-full mx-4 space-y-6"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "fade-in 0.2s ease-out" }}
      >
        <div className="space-y-2">
          <p className="stamp-label text-error">Confirm Deletion</p>
          <h3 className="font-serif text-headline-md text-secondary-fixed">
            Delete user "{userName}"?
          </h3>
        </div>
        <p className="font-serif text-body-md text-on-surface-variant">
          This action is <strong>permanent</strong>. All of this user's journals,
          notes, and challenges will be removed.
        </p>
        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn-danger px-6 py-2"
          >
            {loading ? "Deleting…" : "Delete User"}
          </button>
          <button onClick={onCancel} className="btn-ghost py-2 text-xs">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Main Admin Page ---- */
export default function Admin() {
  const [stats, setStats] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const limit = 15;

  // Fetch stats once
  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  // Fetch users when page changes
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers(page, limit);
      setUsersData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUser(deleteTarget._id);
      setDeleteTarget(null);
      // Refresh stats & users
      getStats().then(setStats);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading && !usersData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingState message="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background desk-texture py-12 px-4">
      <div
        className="max-w-5xl mx-auto space-y-12"
        style={{ animation: "fade-in 0.4s ease-out" }}
      >
        {/* Header */}
        <div className="space-y-2">
          <p className="stamp-label text-primary">Admin</p>
          <h1
            className="font-serif text-display-lg text-secondary-fixed"
            style={{ letterSpacing: "-0.02em" }}
          >
            Dashboard
          </h1>
        </div>

        {/* Error banner */}
        {error && (
          <div
            className="journal-paper p-4 border-l-error"
            style={{ borderLeftColor: "var(--color-error)" }}
          >
            <p className="font-serif text-body-md text-error">{error}</p>
            <button
              onClick={() => setError(null)}
              className="stamp-label text-outline mt-2 hover:text-secondary transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard
              label="Total Users"
              value={stats.totalUsers}
              accent="var(--color-primary)"
            />
            <StatCard
              label="Recent Signups (7d)"
              value={stats.signupsLast7Days}
              accent="var(--color-primary-fixed)"
            />
            <StatCard
              label="Journals"
              value={stats.totalJournals}
              accent="var(--color-secondary)"
            />
            <StatCard label="Notes" value={stats.totalNotes} />
            <StatCard
              label="Challenges"
              value={stats.totalChallenges}
              accent="var(--color-tertiary)"
            />
          </div>
        )}

        {/* System Health Section */}
        {stats?.systemHealth && (
          <div className="space-y-4">
            <p className="stamp-label text-tertiary">System Health (Database)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Data Size"
                value={`${stats.systemHealth.dbSizeMB} MB`}
              />
              <StatCard
                label="Storage Size"
                value={`${stats.systemHealth.storageSizeMB} MB`}
              />
              <StatCard
                label="Collections"
                value={stats.systemHealth.collections}
              />
              <StatCard
                label="Active Connections"
                value={stats.systemHealth.connections}
              />
            </div>
          </div>
        )}

        <div
          className="w-16 h-px"
          style={{
            background:
              "color-mix(in srgb, var(--color-outline-variant) 50%, transparent)",
          }}
        />

        {/* Users Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="stamp-label text-tertiary">All Users</p>
            {usersData && (
              <p className="stamp-label text-outline">
                Page {usersData.page} of {usersData.totalPages}
              </p>
            )}
          </div>

          <div className="journal-paper overflow-hidden">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Last Login</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData?.users?.map((u) => (
                    <tr key={u._id}>
                      <td className="font-serif text-secondary-fixed">
                        {u.userName}
                      </td>
                      <td className="text-on-surface-variant">{u.email}</td>
                      <td>
                        <span
                          className={`admin-role-badge ${u.role === "admin" ? "admin-role-admin" : ""}`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="text-on-surface-variant">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="text-on-surface-variant">
                        {formatDate(u.lastLogin)}
                      </td>
                      <td className="text-right">
                        {u.role !== "admin" && (
                          <button
                            onClick={() => setDeleteTarget(u)}
                            className="btn-danger text-xs"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {usersData?.users?.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center font-serif italic text-on-surface-variant py-8"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {usersData && usersData.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn-ghost py-1.5 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <span className="stamp-label text-on-surface-variant">
                {page} / {usersData.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(usersData.totalPages, p + 1))
                }
                disabled={page >= usersData.totalPages}
                className="btn-ghost py-1.5 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          userName={deleteTarget.userName}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
